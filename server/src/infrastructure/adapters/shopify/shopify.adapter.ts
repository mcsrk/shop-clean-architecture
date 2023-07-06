import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

// Config
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';

// Interfaces
import { IEcommerceAdapter } from '../ecommerce.adapter.interface';
import { IProductInput } from '../../../entities/product/product.interface';

// Entities
import { Product } from '../../../entities/product/product.entity';

export class ShopifyAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;
	private authConfig: AxiosRequestConfig;
	private readonly defaultValuesDb: IProductInput;

	constructor() {
		this.defaultValuesDb = {
			parent_id: null,
			init: true,
			external_id: '',
			search_text: '',
			name: '',
			price: 0,
			image: '',
			json_product: {},
			sku: '',
			store_product_id: 'Shopify - HeavenStore',
		};
		this.authConfig = {
			auth: {
				username: CONFIG.SHOPIFY.APIKEY,
				password: CONFIG.SHOPIFY.PASSWORD,
			},
		};
		this.client = axios.create({
			baseURL: `https://${CONFIG.SHOPIFY.SHOP_NAME}.myshopify.com/admin/api/${CONFIG.SHOPIFY.API_VERSION}`,
			...this.authConfig,
		});
	}
	private async requestShopifyAPI(url: string, params: object = {}): Promise<any> {
		const response = await this.client.get(url, { params });
		return response;
	}

	private async requestShopifyNextPage(nextPageUrl: string): Promise<any> {
		try {
			const response = await axios.get(nextPageUrl, this.authConfig);
			return response;
		} catch (error: any) {
			console.error('Error making GET request in Shopify:', error);

			throw error;
		}
	}

	private getNextPageUrlFromLinkHeader(linkHeader: string): string | null {
		const linkRegex = /<([^>]+)>;\s*rel="next"/;
		const match = linkRegex.exec(linkHeader);
		return match ? match[1] : null;
	}

	private async getProductById(productId: number): Promise<any> {
		try {
			const url = `/products/${productId}.json`;
			const response = await this.requestShopifyAPI(url);
			const product = response.data.product;

			return product;
		} catch (error: any) {
			Logging.error(`Error getting product with ID ${productId} from Shopify: ${error}`);
			throw error;
		}
	}

	private async getProductIdsBySearchTerm(searchTerm: string): Promise<any[]> {
		try {
			/** Retrieve initial page of products . Only requests id and title fields*/

			let allProducts: any[] = [];
			const route = '/products.json';
			const response = await this.requestShopifyAPI(route, { fields: 'id,title,tags,body_html' });

			const linkHeader = response.headers.link;
			const products = response.data.products;

			allProducts.push(...products);

			/** Get the next page results Link if exists */
			let nextPageUrl = this.getNextPageUrlFromLinkHeader(linkHeader);

			/** Retrieve rest of the product's as long as there is a next page results link */

			while (nextPageUrl) {
				Logging.info(`[Shopify Adapter] Partial ID & TITLE products: ${allProducts.length}`);

				const currentPageResponse = await this.requestShopifyNextPage(nextPageUrl);
				const currentPageProducts = currentPageResponse.data.products;
				const nextPageLinkHeader = currentPageResponse.headers.link;

				allProducts.push(...currentPageProducts);

				nextPageUrl = this.getNextPageUrlFromLinkHeader(nextPageLinkHeader);
			}
			Logging.info(`[Shopify Adapter] Total ID & TITLE products retrieved: ${allProducts.length}`);

			/** Search for coincidences in title, tags and body_html */
			const matchingProducts = allProducts.filter((product: any) => {
				const { title, tags, body_html } = product;
				const lowercaseSearchTerm = searchTerm.toLowerCase();

				return (
					title.toLowerCase().includes(lowercaseSearchTerm) ||
					(tags && tags.toLowerCase().includes(lowercaseSearchTerm)) ||
					(body_html && body_html.toLowerCase().includes(lowercaseSearchTerm))
				);
			});

			Logging.info(`[Shopify Adapter] Filtered ID & TITLE products by search term: ${matchingProducts.length}`);
			const matchingids = matchingProducts.map((product: any) => product.id);

			return matchingids;
		} catch (error: any) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
	}

	async searchProducts(searchTerm: string): Promise<Product[][]> {
		try {
			/** Get ids of products which title, tag or html_body matches the search term */
			const matchingIds = await this.getProductIdsBySearchTerm(searchTerm);

			/** Get details only for the first 9 products*/
			const MAX_PRODUCTS = CONFIG.SHOPIFY.MAX_PRODUCTS_PER_PAGE - 1;

			const firstN = matchingIds.slice(0, MAX_PRODUCTS);
			const allProductsDetailsPromises = firstN.map((id: number) => this.getProductById(id)) ?? [];
			const allProductsDetails = await Promise.all(allProductsDetailsPromises);
			const productsFormatedToDb = allProductsDetails.map((product) => this.adaptProductToDB(product));

			Logging.info(`[Shopify Adapter] Total products by id retrieved: ${allProductsDetails.length}`);

			return productsFormatedToDb;
		} catch (error: any) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
	}

	private async getAllProducts(): Promise<any[]> {
		try {
			/** Retrieve initial page of products*/
			Logging.info(`[Shopify Adapter] Retrieving all products...`);

			let allProducts: any[] = [];
			const route = '/products.json';
			const response = await this.requestShopifyAPI(route);

			const linkHeader = response.headers.link;
			const products = response.data.products;

			allProducts.push(...products);

			/** Get the next page results Link if exists */
			let nextPageUrl = this.getNextPageUrlFromLinkHeader(linkHeader);

			/** Retrieve rest of the product's as long as there is a next page results link */

			while (nextPageUrl) {
				Logging.info(`[Shopify Adapter] Partial Products Retrieved: ${allProducts.length}`);

				const currentPageResponse = await this.requestShopifyNextPage(nextPageUrl);
				const currentPageProducts = currentPageResponse.data.products;
				const nextPageLinkHeader = currentPageResponse.headers.link;

				allProducts.push(...currentPageProducts);

				nextPageUrl = this.getNextPageUrlFromLinkHeader(nextPageLinkHeader);
			}

			Logging.info(`[Shopify Adapter] Retrived All Products: ${products.length}`);

			return products;
		} catch (error: any) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
	}

	async fetchAllProducts(): Promise<Product[][]> {
		try {
			/** Get all products availabe and format them*/
			const allProducts = await this.getAllProducts();
			const productsFormatedToDb = allProducts.map((product) => this.adaptProductToDB(product));

			Logging.info(`[Shopify Adapter] Total products in GET ALL SEARCH: ${productsFormatedToDb.length}`);

			return productsFormatedToDb;
		} catch (error: any) {
			console.error('Error searching ALL products in Shopify:', error);
			return [];
		}
	}

	adaptProductToDB(shopifyProduct: any): Product[] {
		let responseFormattedProducts: Product[] = [];

		const { id, variants, options } = shopifyProduct;

		if (variants.length === 0) {
			Logging.warning(`[Shopify Adapter] Adapt to DB - ShopifyProduct Id: ${id} has no variants`);
		}

		if (options.length === 0) {
			Logging.warning(`[Shopify Adapter] Adapt to DB - ShopifyProduct Id: ${id} has no options`);
		}

		const parentProductData: IProductInput = {
			parent_id: this.defaultValuesDb.parent_id,
			init: false,
			external_id: id ?? this.defaultValuesDb.external_id,
			search_text: shopifyProduct.title ?? this.defaultValuesDb.search_text,
			name: shopifyProduct.title ?? this.defaultValuesDb.name,
			price: Number(variants[0].price) ?? this.defaultValuesDb.price,
			image: shopifyProduct?.image?.src ?? shopifyProduct?.images[0]?.src ?? this.defaultValuesDb.image,
			json_product: shopifyProduct ?? this.defaultValuesDb.json_product,
			sku: id ?? this.defaultValuesDb.sku,
			store_product_id: /*id ??*/ this.defaultValuesDb.store_product_id,
		};

		const parentProduct = new Product(parentProductData);
		responseFormattedProducts.push(parentProduct);

		const parsedVariants: Product[] = variants?.map((variant: any) => {
			if (!variant.title) {
				Logging.warning(
					`[Shopify Adapter] Adapt to DB - ShopifyProduct Id: ${id} - variant: ${variant.id} no tiene titulo: ${variant.title}. `,
				);
			}

			const variantData: IProductInput = {
				parent_id: parentProduct.product_id,
				init: this.defaultValuesDb.init,
				external_id: variant.id ?? this.defaultValuesDb.external_id,
				search_text: variant.title ?? this.defaultValuesDb.search_text,
				name: variant.title ?? this.defaultValuesDb.name,
				price: Number(variant.price) ?? this.defaultValuesDb.price,
				image: '' ?? this.defaultValuesDb.image,
				json_product: variant ?? this.defaultValuesDb.json_product,
				sku: variant.id ?? this.defaultValuesDb.sku,
				store_product_id: /* variant.product_id ?? */ this.defaultValuesDb.store_product_id,
			};

			return new Product(variantData);
		});

		return responseFormattedProducts.concat(parsedVariants);
	}
}

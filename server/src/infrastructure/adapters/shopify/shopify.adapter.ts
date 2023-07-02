import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IEcommerceAdapter } from '../ecommerce.adapter.interface';

// Config
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';
import { EcommerceProduct } from '../ecommerce.product.interface';

export class ShopifyAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;
	private authConfig: AxiosRequestConfig;
	private readonly defaultValues: EcommerceProduct;

	constructor() {
		this.defaultValues = {
			external_id: 'no val at shopify adapter',
			product_id: 'no val at shopify adapter',
			sku: 'no val at shopify adapter',
			image: 'no val at shopify adapter',
			name: 'no val at shopify adapter',
			short_description: 'no val at shopify adapter',
			long_description: 'no val at shopify adapter',
			price: '1',
			variants: [],
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

	async searchProducts(searchTerm: string): Promise<any[]> {
		try {
			/** Get ids of products which title, tag or html_body matches the search term */
			const matchingIds = await this.getProductIdsBySearchTerm(searchTerm);

			/** Get details only for the first 9 products*/
			const MAX_PRODUCTS = CONFIG.SHOPIFY.MAX_PRODUCTS_PER_PAGE - 1;

			const firstN = matchingIds.slice(0, MAX_PRODUCTS);
			const allProductsDetailsPromises = firstN.map((id: number) => this.getProductById(id)) ?? [];
			const allProductsDetails = await Promise.all(allProductsDetailsPromises);

			Logging.info(`[Shopify Adapter] Total products by id retrieved: ${allProductsDetails.length}`);

			return allProductsDetails;
		} catch (error: any) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
	}

	// adapts raw product data to server response product format
	adaptProduct(shopifyProduct: any): EcommerceProduct {
		const { id, variants, options } = shopifyProduct;

		if (variants.length === 0) {
			Logging.warning(`[EcommerceProduct] shopifyProduct Id: ${id} no tiene variants`);
		}

		if (options.length === 0) {
			Logging.warning(`[EcommerceProduct] shopifyProduct Id: ${id} no tiene options`);
		}

		const variantAttributeName = options?.name ?? ''; //example: "Size" when the main product is a shoe

		const parsedVariants = variants?.map((variant: any) => {
			if (!variant.title) {
				Logging.warning(
					`[EcommerceProduct] shopifyProduct Id: ${id} - variant: ${variant.id} no tiene titulo: ${variant.title}. `,
				);
			}
			const selectedOptions =
				variantAttributeName && variant.title ? [{ name: variantAttributeName, value: variant.title }] : {};
			return {
				legacyResourceId: variant.id,
				inventoryQuantity: variant.inventory_quantity,

				selectedOptions,

				displayName: variant.name ?? variant.title,
				price: variant.price,
			};
		});

		const ecommerceProductFormatted = Object.freeze({
			external_id: shopifyProduct.id ?? this.defaultValues.external_id,
			product_id: shopifyProduct.id ?? this.defaultValues.product_id,
			sku: shopifyProduct.sku ?? this.defaultValues.sku,
			image: shopifyProduct.images?.[0]?.src ?? this.defaultValues.image,
			name: shopifyProduct.title ?? this.defaultValues.name,
			short_description: shopifyProduct.body_html ?? this.defaultValues.short_description,
			long_description: shopifyProduct.body_html ?? this.defaultValues.long_description,
			price: shopifyProduct.price ?? this.defaultValues.price,
			variants: parsedVariants ?? this.defaultValues.variants,
		});

		return ecommerceProductFormatted;
	}
}

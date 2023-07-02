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
	private async requestShopifyAPI(url: string, params: object): Promise<any> {
		const response = await this.client.get(url, { params });
		return response;
	}

	async searchProducts(searchTerm: string): Promise<any[]> {
		try {
			/** Retrieve initial page of products */

			let allProducts: any[] = [];
			const route = '/products.json';
			const response = await this.requestShopifyAPI(route, { title: searchTerm });

			const linkHeader = response.headers.link;
			const products = response.data.products;

			allProducts.push(...products);

			let nextPageUrl = this.getNextPageUrlFromLinkHeader(linkHeader);

			/** Retrieve rest of the product's as long as there is a next page link */
			// FIXME: commented GET ALL PAGES
			// while (nextPageUrl) {
			// 	Logging.info(`[Shopify Adapter] Partial products: ${allProducts.length}`);

			// 	const currentPageResponse = await this.requestShopifyNextPage(nextPageUrl);
			// 	const currentPageProducts = currentPageResponse.data.products;
			// 	const nextPageLinkHeader = currentPageResponse.headers.link;

			// 	allProducts.push(...currentPageProducts);

			// 	nextPageUrl = this.getNextPageUrlFromLinkHeader(nextPageLinkHeader);
			// }
			Logging.info(`[Shopify Adapter] Total products retrieved: ${allProducts.length}`);
			return allProducts;
		} catch (error: any) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
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

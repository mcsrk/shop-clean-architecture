import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { IEcommerceAdapter } from './ecommerce.adapter.interface';

// Config
import { CONFIG } from '../config/config';

// Custom library
import Logging from '../library/Logging';

export class ShopifyAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;
	private authConfig: AxiosRequestConfig;

	constructor() {
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
			while (nextPageUrl) {
				Logging.info(`[Shopify Adapter] Partial products: ${allProducts.length}`);

				const currentPageResponse = await this.requestShopifyNextPage(nextPageUrl);
				const currentPageProducts = currentPageResponse.data.products;
				const nextPageLinkHeader = currentPageResponse.headers.link;

				allProducts.push(...currentPageProducts);

				nextPageUrl = this.getNextPageUrlFromLinkHeader(nextPageLinkHeader);
			}
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
}

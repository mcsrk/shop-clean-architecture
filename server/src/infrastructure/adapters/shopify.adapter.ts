import axios, { AxiosInstance } from 'axios';
import { IEcommerceAdapter } from './ecommerce.adapter';
import { CONFIG } from '../config/config';

export class ShopifyAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: `https://${CONFIG.SHOPIFY.SHOP_NAME}.myshopify.com/admin/api/${CONFIG.SHOPIFY.API_VERSION}`,
			auth: {
				username: CONFIG.SHOPIFY.APIKEY,
				password: CONFIG.SHOPIFY.PASSWORD,
			},
		});
	}

	async searchProducts(searchTerm: string): Promise<any[]> {
		try {
			const response = await this.client.get('/products.json', {
				params: {
					title: '',
				},
			});
			return response.data.products;
		} catch (error) {
			console.error('Error searching products in Shopify:', error);
			return [];
		}
	}
}

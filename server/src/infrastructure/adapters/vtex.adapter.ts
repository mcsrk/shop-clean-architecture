import axios, { AxiosInstance } from 'axios';

import { IEcommerceAdapter } from './ecommerce.adapter.interface';

import { CONFIG } from '../config/config';

export class VtexAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;

	constructor() {
		this.client = axios.create({
			baseURL: `https://${CONFIG.VTEX.ACCOUNT_NAME}.${CONFIG.VTEX.ENVIROMENT}.com.br`,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				'X-VTEX-API-AppKey': CONFIG.VTEX.APP_KEY,
				'X-VTEX-API-AppToken': CONFIG.VTEX.APP_TOKEN,
			},
		});
	}

	async searchProducts(searchterm: string = ''): Promise<any[]> {
		try {
			const response = await this.client.get(`/api/catalog_system/pub/products/search/${searchterm}`);
			return response.data;
		} catch (error) {
			console.error('Error getting products from VTEX:', error);
			return [];
		}
	}
}

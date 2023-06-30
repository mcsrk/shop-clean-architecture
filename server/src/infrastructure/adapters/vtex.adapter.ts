import axios, { AxiosInstance } from 'axios';

import { IEcommerceAdapter } from './ecommerce.adapter.interface';

// Config
import { CONFIG } from '../config/config';

// Custom Library
import Logging from '../library/Logging';

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
			const allProducts: any[] = [];
			let from = 0;
			let to = 9;
			let totalElements = 0;

			do {
				const response = await this.getPaginatedProducts(from, to, searchterm);
				const products = response.data;
				allProducts.push(...products);

				const resourcesHeader = response.headers.resources;
				const [range, total] = resourcesHeader.split('/');

				totalElements = parseInt(total);
				const [start, end] = range.split('-');

				from = parseInt(start) + 10;
				to = parseInt(end) + 10;
				Logging.info(`[Vtex Adapter] Partial products: ${allProducts.length}`);
			} while (from < totalElements);

			Logging.info(`[Vtex Adapter] Total products retrieved: ${allProducts.length}`);
			return allProducts;
		} catch (error: any) {
			console.error('Error getting products from VTEX:', error);
			return [];
		}
	}
	private async getPaginatedProducts(_from: number, _to: number, searchTerm: string): Promise<any> {
		const response = await this.client.get(`/api/catalog_system/pub/products/search/${searchTerm}`, {
			params: {
				_from,
				_to,
			},
		});
		return response;
	}
}

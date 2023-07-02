import axios, { AxiosInstance } from 'axios';

import { IEcommerceAdapter } from '../ecommerce.adapter.interface';

// Config
import { CONFIG } from '../../config/config';

// Custom Library
import Logging from '../../library/Logging';
import { EcommerceProduct } from '../ecommerce.product.interface';

export class VtexAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;
	private readonly defaultValues: EcommerceProduct;

	constructor() {
		this.defaultValues = {
			external_id: 'no val at vtex adapter',
			product_id: 'no val at vtex adapter',
			sku: 'no val at vtex adapter',
			image: '',
			name: 'no val at vtex adapter',
			short_description: 'no val at vtex adapter',
			long_description: 'no val at vtex adapter',
			price: '2',
			variants: [],
		};
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
			// FIXME:Commented GET ALL PAGES. convert
			// let totalElements = 0;
			let totalElements = 10;

			do {
				const response = await this.getPaginatedProducts(from, to, searchterm);
				const products = response.data;
				allProducts.push(...products);

				const resourcesHeader = response.headers.resources;
				const [range, total] = resourcesHeader.split('/');
				// FIXME:Commented GET ALL PAGES. convert totalElemtns = 0
				// totalElements = parseInt(total);
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

	adaptProduct(vtexProduct: any): EcommerceProduct {
		const { productId: id, items } = vtexProduct;

		if (items.length === 0) {
			Logging.warning(`[EcommerceProduct] vtexProduct Id: ${id} no tiene items`);
		}

		const variants = items.map((item: any) => {
			const { itemId: variantId, sellers, referenceId, nameComplete, name } = item;

			if (sellers.length === 0) {
				Logging.warning(
					`[EcommerceProduct] vtexProduct Id: ${id} - item: ${variantId} no tiene sellers: ${sellers}. La variante ${variantId} no tendra precio ni cantidad`,
				);
			}
			if (referenceId.length === 0) {
				Logging.warning(
					`[EcommerceProduct] vtexProduct Id: ${id} - item: ${variantId} no tiene referenceId: ${referenceId}. La variante ${variantId} no tendra selected options `,
				);
			}
			// se usa el  seller 0 para definir el precio y cantidad (un poco arbitrario)
			const rootSeller = sellers[0];
			const quantity = rootSeller?.commertialOffer?.AvailableQuantity ?? -1;
			const price = rootSeller?.commertialOffer?.Price ?? -1;

			const variantBody = {
				legacyResourceId: variantId.toString(),
				inventoryQuantity: quantity,
				selectedOptions:
					referenceId?.map((attr: any) => ({
						name: attr.Key,
						value: attr.Value,
					})) ?? {},
				displayName: nameComplete ?? name,
				price: price,
			};
			return variantBody;
		});

		const ecommerceProductFormatted = Object.freeze({
			external_id: vtexProduct.productId ?? this.defaultValues.external_id,
			product_id: vtexProduct.sku ?? this.defaultValues.product_id,
			sku: vtexProduct.productId ?? this.defaultValues.sku,
			image: vtexProduct?.items?.images?.[0]?.imageUrl ?? this.defaultValues.image,
			name: vtexProduct.productName ?? this.defaultValues.name,
			short_description: vtexProduct.productName ?? this.defaultValues.short_description,
			long_description: vtexProduct.description ?? this.defaultValues.long_description,
			price: vtexProduct?.items[0].sellers[0].commertialOffer.Price ?? this.defaultValues.price,
			variants: variants ?? this.defaultValues.variants,
		});

		return ecommerceProductFormatted;
	}
}

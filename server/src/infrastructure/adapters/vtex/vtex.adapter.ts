import axios, { AxiosInstance } from 'axios';

// Config
import { CONFIG } from '../../config/config';

// Custom library
import Logging from '../../library/Logging';

// Interfaces
import { IEcommerceAdapter } from '../ecommerce.adapter.interface';
import { IProductInput } from '../../../entities/product/product.interface';

// Entities
import { Product } from '../../../entities/product/product.entity';

export class VtexAdapter implements IEcommerceAdapter {
	private client: AxiosInstance;
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
			store_product_id: 'VTEX - MagicStore',
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

	async searchProducts(searchTerm: string = ''): Promise<Product[][]> {
		try {
			/** VTEX Api behavior is odd if search term is less than 3 chars long  */
			const MAX_PRODUCTS = CONFIG.VTEX.MAX_PRODUCTS_PER_PAGE;
			const fixedSearchTerm = searchTerm && searchTerm.length >= 3 ? searchTerm : '';

			const allProducts: any[] = [];
			let from = 0;
			let to = 9;
			let totalElements = 0;

			do {
				const response = await this.getPaginatedProducts(from, to, fixedSearchTerm);
				const products = response.data;
				allProducts.push(...products);

				const resourcesHeader = response.headers.resources;
				const [range, total] = resourcesHeader.split('/');

				totalElements = fixedSearchTerm ? parseInt(total) : MAX_PRODUCTS;

				const [start, end] = range.split('-');
				from = parseInt(start) + 10;
				to = parseInt(end) + 10;

				Logging.info(`[Vtex Adapter] Partial products: ${allProducts.length}`);
			} while (from < totalElements);

			const productsFormatedToDb = allProducts.map((product) => this.adaptProductToDB(product));

			Logging.info(`[Vtex Adapter] Total products retrieved: ${allProducts.length} from ${totalElements} allowed.`);
			return productsFormatedToDb;
		} catch (error: any) {
			console.error('Error getting products from VTEX:', error);
			return [];
		}
	}

	private async getAllProductsPaginated(_from: number, _to: number): Promise<any> {
		const response = await this.client.get(`/api/catalog_system/pub/products/search `, {
			params: {
				_from,
				_to,
			},
		});
		return response;
	}

	async fetchAllProducts(): Promise<Product[][]> {
		try {
			/** VTEX Api get all prodcuts with 10 products step*/

			const allProducts: any[] = [];
			let from = 0;
			let to = 9;
			let totalElements = 0;

			do {
				const response = await this.getAllProductsPaginated(from, to);
				const products = response.data;
				allProducts.push(...products);

				const resourcesHeader = response.headers.resources;
				const [range, total] = resourcesHeader.split('/');

				totalElements = parseInt(total);

				const [start, end] = range.split('-');
				from = parseInt(start) + 10;
				to = parseInt(end) + 10;

				Logging.info(`[Vtex Adapter] Partial ALL products: ${allProducts.length}`);
			} while (from < totalElements);

			Logging.info(`[Vtex Adapter] Total ALL Retrieved: ${allProducts.length} from ${totalElements} available.`);
			const productsFormatedToDb = allProducts.map((product) => this.adaptProductToDB(product));

			return productsFormatedToDb;
		} catch (error: any) {
			Logging.error('Error getting all products from VTEX:');
			Logging.error(error);
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

	adaptProductToDB(vtexProduct: any): Product[] {
		let responseFormattedProducts: Product[] = [];

		const { productId: id, items } = vtexProduct;

		if (items.length === 0) {
			Logging.warning(`[VTEX Adapt] Adapt to DB - VtexProduct Id: ${id} has no items`);
		}

		const firstVariantPrice = items[0].sellers[0].commertialOffer.Price;
		const firstVariantImage = items[0].images[0].imageUrl;

		const parentProductData: IProductInput = {
			parent_id: this.defaultValuesDb.parent_id,
			init: false,
			external_id: id ?? this.defaultValuesDb.external_id,
			search_text: vtexProduct.productName ?? this.defaultValuesDb.search_text,
			name: vtexProduct.productName ?? this.defaultValuesDb.name,
			price: Number(firstVariantPrice) ?? this.defaultValuesDb.price,
			image: firstVariantImage ?? this.defaultValuesDb.image,
			json_product: (({ items, ...rest }) => rest)(vtexProduct) ?? this.defaultValuesDb.json_product,
			sku: id ?? this.defaultValuesDb.sku,
			store_product_id: /* id ?? */ this.defaultValuesDb.store_product_id,
		};

		const parentProduct = new Product(parentProductData);
		responseFormattedProducts.push(parentProduct);

		const parsedVariants: Product[] = items?.map((item: any) => {
			const { itemId: variantId, sellers, nameComplete, name, images } = item;

			if (sellers.length === 0) {
				Logging.warning(
					`[VTEX Adapt] Adapt to DB - VtexProduct Id: ${id} - item: ${variantId} has no sellers: ${sellers}. Variant ${variantId} has no quantity`,
				);
			}

			// se usa el  seller 0 para definir el precio y cantidad (un poco arbitrario)
			const rootSeller = sellers[0];
			const variantPrice = rootSeller?.commertialOffer?.Price ?? -1;
			const variantImage = images[0].imageUrl;

			const variantData: IProductInput = {
				parent_id: parentProduct.product_id,
				init: this.defaultValuesDb.init,
				external_id: variantId ?? this.defaultValuesDb.external_id,
				search_text: nameComplete ?? this.defaultValuesDb.search_text,
				name: name ?? this.defaultValuesDb.name,
				price: Number(variantPrice) ?? this.defaultValuesDb.price,
				image: variantImage ?? this.defaultValuesDb.image,
				json_product: item ?? this.defaultValuesDb.json_product,
				sku: variantId ?? this.defaultValuesDb.sku,
				store_product_id: /* variantId ?? */ this.defaultValuesDb.store_product_id,
			};

			return new Product(variantData);
		});

		return responseFormattedProducts.concat(parsedVariants);
	}
}

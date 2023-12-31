// Custom Library
import Logging from '../../library/Logging';

// Interfaces
import { IECommerceRepository } from './ecommerce.repository.interface';

// Entities
import { Product } from '../../../entities/product/product.entity';

// Ecommerce adapters
import { ShopifyAdapter } from '../../adapters/shopify/shopify.adapter';
import { VtexAdapter } from '../../adapters/vtex/vtex.adapter';

type ApiClients = {
	[storeName: string]: ShopifyAdapter | VtexAdapter;
};

const ecommerceAdapters: ApiClients = {
	MagicStore: new VtexAdapter(),
	HeavenStore: new ShopifyAdapter(),
};

export class ECommerceRepository implements IECommerceRepository {
	async searchProducts(companyPrefix: string, searchTerm: string): Promise<Product[][]> {
		Logging.info(`[1 Ecommerce Repository] Search products from ${companyPrefix} using search term ${searchTerm}`);

		const ecommerceAdapter = ecommerceAdapters[companyPrefix];

		if (!ecommerceAdapter) {
			throw new Error(`Ecommerce store: "${companyPrefix}" is not supported`);
		}

		try {
			const ecommerceProductsFormattedToDB = await ecommerceAdapter.searchProducts(searchTerm);

			Logging.info(
				`[2 Ecommerce Repository] Search products got ${ecommerceProductsFormattedToDB.length} products from   ${companyPrefix} `,
			);

			return ecommerceProductsFormattedToDB;
		} catch (err: any) {
			const message = err.message;
			Logging.error(`[ECommerceRepo] Error getting products from ${companyPrefix} ecommerce: ${message}`);
			throw new Error(`Error getting products from ${companyPrefix} ecommerce: ${message}`);
		}
	}

	async fetchAllProducts(companyPrefix: string): Promise<Product[][]> {
		Logging.info(`[1 Ecommerce Repository] Fetch all products from ${companyPrefix}`);

		const ecommerceAdapter = ecommerceAdapters[companyPrefix];

		if (!ecommerceAdapter) {
			throw new Error(`Ecommerce store: "${companyPrefix}" is not supported`);
		}

		try {
			const ecommerceProductsFormattedToDB = await ecommerceAdapter.fetchAllProducts();

			Logging.info(
				`[2 Ecommerce Repository] Fetch all products got ${ecommerceProductsFormattedToDB.length} products from ${companyPrefix} `,
			);

			return ecommerceProductsFormattedToDB;
		} catch (err: any) {
			const message = err.message;
			Logging.error(
				`[ECommerceRepo] Error getting retrieving all products from ${companyPrefix} ecommerce: ${message}`,
			);
			throw new Error(`Error getting retrieving all products from ${companyPrefix} ecommerce: ${message}`);
		}
	}
}

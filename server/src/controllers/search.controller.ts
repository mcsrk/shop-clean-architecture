// Types
import { Request, Response } from 'express';

// Entities
import { Product } from '../entities/product/product.entity';
import { FilterParams } from '../entities/filter-params/filter-params.entity';

// Use cases
import ProductService from '../use-cases/products';
import EcommerceService from '../use-cases/ecommerce';

// Custom library
import Logging from '../infrastructure/library/Logging';

export class SearchController {
	// ecommerceUseCase -> Triggers the product query in the requested ecommerce
	// productUseCase ->  Insert products and variants
	constructor(private ecommerceUseCase: EcommerceService, private productUseCase: ProductService) {
		this.searchProductsUsingParams = this.searchProductsUsingParams.bind(this);
	}

	public async searchProductsUsingParams(req: Request, res: Response) {
		try {
			const filterParamsEntity = new FilterParams(req.query);

			const searchTerm = filterParamsEntity.search_text as string;

			const companyPrefix = req.params.companyPrefix as string;
			if (!companyPrefix) {
				return res.status(400).json({ success: false, message: 'Missing request param: companyPrefix is required!' });
			}

			Logging.info(`[search.controller] Getting products from ${companyPrefix} Ecommerce...`);

			/** 1. Trigger products query to requested ecommerce
			 * Gets an array of type: [[mainProduct, ...variants],...,[mainProduct, ...variants]]
			 * format useful for traceability of the request
			 */

			const dbFormattedEcommerceProductsMatrix =
				(await this.ecommerceUseCase.searchProducts(companyPrefix, searchTerm || '')) ?? [];
			Logging.info(
				`[search.controller] Retrieved ${dbFormattedEcommerceProductsMatrix.length} products from ${companyPrefix} Ecommerce`,
			);

			/** 2. Insert products and variants obtained from the ecommerce query */

			Logging.info(
				`[search.controller] Inserting ${dbFormattedEcommerceProductsMatrix.length} products with variants into own database...`,
			);

			/** Simplify the matrix to an array of type:
			 * [mainProduct1, ...variants1, ..., mainProduct-n, ...variants-n]*/

			const allMainProductsAndVariants: Product[] = dbFormattedEcommerceProductsMatrix.flatMap(
				(productAndVariants) => productAndVariants,
			);

			const totalMainProducts = dbFormattedEcommerceProductsMatrix.length;
			const totalInsertions = allMainProductsAndVariants.length;
			const totalVariants = totalInsertions - totalMainProducts;

			/** Add products and variants to the database */

			const insertEcommerceDbFormattedPromises =
				allMainProductsAndVariants?.map((product: any) => this.productUseCase.insertDbFormattedProduct(product)) ?? [];
			Logging.info(`[search.controller] Insert Promises: ${insertEcommerceDbFormattedPromises.length}`);

			const insertedProducts = await Promise.all(insertEcommerceDbFormattedPromises);
			Logging.info(`[search.controller] Inserted ${insertedProducts.length} products into own database`);

			return res.status(200).json({
				success: true,
				message: `OK`,
				result: {
					message: `Stored products into own database`,
					store: companyPrefix,
					search_term: searchTerm,
					stored_total: totalInsertions,
					stored_products: totalMainProducts,
					stored_variants: totalVariants,
				},
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: `Error retrieving products from ecommerce`,
				error: (err as Error).message,
			});
		}
	}
}

// Types
import { Request, Response } from 'express';

// Entities
import { Product } from '../entities/product/product.entity';
import { FilterParams } from '../entities/filter-params/filter-params.entity';
import { ProductResponseEntity } from '../entities/response-product/product.response.entity';

// Use cases
import ProductService from '../use-cases/products';
import EcommerceService from '../use-cases/ecommerce';

// Custom library
import Logging from '../infrastructure/library/Logging';

export class ProductController {
	// externalProductUseCase -> Step 1 (Triggers the product query in the requested ecommerce)
	// productUseCase -> Step 4 & 5 (Insert products and variants  & Trigger a search in own database)
	constructor(private externalProductUseCase: EcommerceService, private productUseCase: ProductService) {
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

			Logging.info(`[product.controller] Getting products from ${companyPrefix} Ecommerce...`);

			/** 1. Triggers the product query in the requested ecommerce
			 * Gets an array of type: [[mainProduct, ...variants],...,[mainProduct, ...variants]]
			 * format useful for traceability of the request
			 */

			const dbFormattedEcommerceProductsMatrix =
				(await this.externalProductUseCase.searchProducts(companyPrefix, searchTerm || '')) ?? [];

			Logging.info(
				`[product.controller] Retrieved ${dbFormattedEcommerceProductsMatrix.length} products from ${companyPrefix} Ecommerce`,
			);

			/** 4. Insert products and variants obtained from the ecommerce query */

			Logging.info(
				`[product.controller] Inserting ${dbFormattedEcommerceProductsMatrix.length} products with variants into own database...`,
			);

			/** Simplify the matrix to an array of type:
			 * [mainProduct1, ...variants1, ..., mainProduct-n, ...variants-n]*/

			const allMainProductsAndVariants: Product[] = dbFormattedEcommerceProductsMatrix.flatMap(
				(productAndVariants) => productAndVariants,
			);

			/** Add products and variants to the database */

			const insertEcommerceDbFormattedPromises =
				allMainProductsAndVariants?.map((product: any) => this.productUseCase.insertDbFormattedProduct(product)) ?? [];
			Logging.info(`[product.controller] Insert Promises: ${insertEcommerceDbFormattedPromises.length}`);

			const insertedProducts = await Promise.all(insertEcommerceDbFormattedPromises);
			Logging.info(`[product.controller] Inserted ${insertedProducts.length} products into own database`);

			/** 5. Trigger a search in own database */

			Logging.info(`[product.controller] Searching for products stored in own database based on query parameters:`);
			Logging.warning(filterParamsEntity);

			const filterdProductsWithVariants = await this.productUseCase.selectProductsByFilters(filterParamsEntity);

			/** Applying server-response format to products with their variants */

			const responseProducts = filterdProductsWithVariants?.map(
				(productWithVariants) => new ProductResponseEntity(productWithVariants),
			);
			Logging.info(`[product.controller] Retrieved ${filterdProductsWithVariants?.length} products from own database`);

			return res.status(200).json({
				success: true,
				message: 'OK',
				result: {
					count: responseProducts?.length,
					items: responseProducts,
				},
			});
		} catch (err) {
			res.status(500).json({
				success: false,
				message: 'Error retrieving products',
				error: (err as Error).message,
			});
		}
	}
}

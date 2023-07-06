// Types
import { Request, Response } from 'express';

// Entities
import { FilterParams } from '../entities/filter-params/filter-params.entity';
import { ProductResponseEntity } from '../entities/response-product/product.response.entity';

// Use cases
import ProductService from '../use-cases/products';

// Custom library
import Logging from '../infrastructure/library/Logging';

export class ProductController {
	// productUseCase -> Triggers the product query in the requested ecommerce
	constructor(private productUseCase: ProductService) {
		this.selectOwnProductsUsingParams = this.selectOwnProductsUsingParams.bind(this);
	}

	public async selectOwnProductsUsingParams(req: Request, res: Response) {
		try {
			const filterParamsEntity = new FilterParams(req.query);

			/** 1. Trigger a SELECT Query on own database */

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

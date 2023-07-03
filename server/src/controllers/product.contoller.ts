import { Request, Response } from 'express';
import { ProductService } from '../use-cases/products/index';
import Logging from '../infrastructure/library/Logging';
import EcommerceService from '../use-cases/ecommerce';
import { IProduct } from '../entities/product.interface';

export class ProductController {
	// externalProductUseCase -> Step 1 (search ecommerce products by string)
	// productUseCase -> Step 4 & 5 (insert ecommerce products & query own products)
	constructor(private externalProductUseCase: EcommerceService, private productUseCase: ProductService) {
		this.searchProductsUsingParams = this.searchProductsUsingParams.bind(this);
	}

	public async searchProductsUsingParams(req: Request, res: Response) {
		try {
			const filterParams = req.query;
			const searchTerm = filterParams.search_text as string;

			const companyPrefix = req.params.companyPrefix as string;
			if (!companyPrefix) {
				return res.status(400).json({ success: false, message: 'Missing request param: companyPrefix is required!' });
			}

			Logging.info(`[product.controller] Getting products from ${companyPrefix} Ecommerce...`);

			// TODO: 1 Dispara la consulta de productos en el ecommerce solicitado
			const dbFormattedEcommerceProductsMatrix =
				(await this.externalProductUseCase.searchProducts(companyPrefix, searchTerm || '')) ?? [];

			Logging.info(
				`[product.controller] Retrieved ${dbFormattedEcommerceProductsMatrix.length} prodcuts from ${companyPrefix} Ecommerce`,
			);
			// TODO: 4 Inserta los productos y sus variantes obtenidos de la consulta de los ecommerce
			Logging.info(
				`[product.controller] Inserting ${dbFormattedEcommerceProductsMatrix.length} products with variants into own database...`,
			);
			// Add products to the database AND get main products created, not variants. porque los main tienen el nombre que coincide con el search term

			const allMainProductsAndVariants: IProduct[] = dbFormattedEcommerceProductsMatrix.flatMap(
				(productAndVariants) => productAndVariants,
			);
			// TODO: convert product: any to product: Product. and all the way back to EcommerceAdapters
			const insertEcommerceDbFormattedPromises =
				allMainProductsAndVariants?.map((product: any) => this.productUseCase.insertDbFormattedProduct(product)) ?? [];

			Logging.info(`[product.controller] Inserting promises: ${insertEcommerceDbFormattedPromises.length}`);
			const insertedProducts = await Promise.all(insertEcommerceDbFormattedPromises);

			Logging.info(`[product.controller] Inserted ${insertedProducts.length} products into own database`);

			// TODO: 5 Dispara la busqueda en db propia y trae los productos formateados como respuesta
			Logging.info(`[product.controller] Looking for products saved in own database based on query params...`);
			Logging.info(`[product.controller] Query params:`);
			Logging.warning(filterParams);

			const productsByFilters = await this.productUseCase.selectProductsByFilters(filterParams);

			Logging.info(`[product.controller] Returning ${productsByFilters?.length} prodcuts from own database`);
			res.send({ products: productsByFilters });
		} catch (err) {
			res.status(500).json({
				success: false,
				message: 'Error retrieving products',
				error: (err as Error).message,
			});
		}
	}
}

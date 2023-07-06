import { Op } from 'sequelize';

// Models
import ProductModel from '../../models/product.model';

// Interfaces
import { IProductRepository } from './product.repository.interface';

// Entities
import { FilterParams } from '../../../entities/filter-params/filter-params.entity';
import { Product } from '../../../entities/product/product.entity';

// Custom library
import Logging from '../../library/Logging';

export class ProductRepository implements IProductRepository {
	private insertCounter = 0;
	async selectProductsByFilters(searchParams: FilterParams): Promise<Product[] | null> {
		const { search_text, price, price_operator } = searchParams;

		const where: any = {};
		/** Only SELECT main products, and include variants as a left join new field */
		where.parent_id = {
			[Op.eq]: null,
		};
		/** iLike is case insesintive */
		if (search_text) {
			where.search_text = {
				[Op.iLike]: `%${search_text}%`,
			};
		}

		if (price_operator && price) {
			where.price = {
				[Op[price_operator]]: price,
			};
		}

		/** Get the main products and includes its variants (db associations)  */

		try {
			const products = await ProductModel.findAll({
				where,
				include: {
					model: ProductModel,
					as: 'variants',
				},
			});
			return products;
		} catch (error: any) {
			const message = (error as Error).message;
			Logging.error(`[Product Repository] Error retrieving products: ${message}`);
			throw new Error(`Error retrieving products: ${message}`);
		}
	}

	async insertProduct(product: Product): Promise<Product | null> {
		try {
			const existingProduct = await ProductModel.findOne({ where: { external_id: product.external_id } });

			if (existingProduct) {
				return existingProduct;
			}

			const insertedProduct = await ProductModel.create(product);
			process.stdout.write('\x1B[1A'); // Removed prev line
			process.stdout.clearLine(0);
			this.insertCounter++;
			Logging.warning(
				`[Product Repository] Inserted ${this.insertCounter}th prod: ExtId:${product.external_id} - ${
					product.name.slice(0, 10) + '...'
				}`,
			);
			return insertedProduct;
		} catch (error: any) {
			const message = error.message;

			Logging.error(`[Product Repository] Error inserting product: ${message}`);

			throw new Error(`Error inserting product: ${message}`);
		}
	}
}

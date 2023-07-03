import { Op } from 'sequelize';

import { IProduct, ISearchParams } from '../../entities/product.interface';
import { IProductRepository } from '../../entities/product.repository.interface';
import { Product } from '../../entities/product.entity';

import Logging from '../library/Logging';
import ProductModel from '../models/product.model';

export class ProductRepository implements IProductRepository {
	async getProducts(searchParams: ISearchParams): Promise<IProduct[] | null> {
		const { search_text, price, price_operator } = searchParams;
		const where: any = {};

		if (search_text) {
			where.name = {
				[Op.like]: `%${search_text}%`,
			};
		}

		if (price && price_operator) {
			where.price = {
				[Op[price_operator]]: price,
			};
		}

		try {
			const products = await ProductModel.findAll({
				where,
			});
			return products;
		} catch (error: any) {
			const message = (error as Error).message;
			Logging.error(`[Product Repository] Error retrieving products: ${message}`);
			throw new Error(`Error retrieving products: ${message}`);
		}
	}

	async insertProduct(product: Product): Promise<IProduct | null> {
		try {
			const exists = await ProductModel.findOne({ where: { external_id: product.external_id } });
			if (exists) {
				return exists;
			}
			const newProduct = await ProductModel.create(product);
			return newProduct;
		} catch (error: any) {
			const message = error.message;
			Logging.error(`[Product Repository] Error inserting product: ${message}`);
			throw new Error(`Error inserting product: ${message}`);
		}
	}
}

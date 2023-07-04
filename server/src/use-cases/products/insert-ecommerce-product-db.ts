// Interfaces
import { IProductRepository } from '../../entities/product.repository.interface';

// Entities
import { Product } from '../../entities/product/product.entity';

export class InsertDBFormattedProduct {
	/** Shorthand property initialization  */
	constructor(private readonly productRepository: IProductRepository) {}

	public insertDBFormattedProduct = async (product: Product) => {
		// Save the product to the database
		const productCreated = await this.productRepository.insertProduct(product);

		return productCreated;
	};
}

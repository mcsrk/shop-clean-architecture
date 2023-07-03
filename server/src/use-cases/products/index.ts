import { IProductRepository } from '../../entities/product.repository.interface';
import { InsertDBFormattedProduct } from './insert-ecommerce-product-db';
import { Product } from '../../entities/product.entity';
export class ProductService {
	private _insertDbFormattedProduct: InsertDBFormattedProduct;

	}
	constructor(productRepository: IProductRepository) {
		this._insertDbFormattedProduct = new InsertDBFormattedProduct(productRepository);
	}
	insertDbFormattedProduct = (product: Product) => {
		return this._insertDbFormattedProduct.insertDBFormattedProduct(product);
	};
}

export default ProductService;

// Interfaces
import { IProductRepository } from '../../entities/product.repository.interface';
import { ISearchParams } from '../../entities/product.interface';

// Entities
import { Product } from '../../entities/product.entity';

// Use cases
import { SelectProductsByfilters } from './select-products-by-filters';
import { InsertDBFormattedProduct } from './insert-ecommerce-product-db';

export class ProductService {
	private _selectProductsByFilters: SelectProductsByfilters;
	private _insertDbFormattedProduct: InsertDBFormattedProduct;

	constructor(productRepository: IProductRepository) {
		this._selectProductsByFilters = new SelectProductsByfilters(productRepository);
		this._insertDbFormattedProduct = new InsertDBFormattedProduct(productRepository);
	}

	selectProductsByFilters = (searchParams: ISearchParams) => {
		return this._selectProductsByFilters.selectProductsByFilters(searchParams);
	};

	insertDbFormattedProduct = (product: Product) => {
		return this._insertDbFormattedProduct.insertDBFormattedProduct(product);
	};
}

export default ProductService;

// Interfaces
import { IProductRepository } from '../../infrastructure/repository/product/product.repository.interface';

// Entities
import { Product } from '../../entities/product/product.entity';
import { FilterParams } from '../../entities/filter-params/filter-params.entity';

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

	selectProductsByFilters = (searchParams: FilterParams) => {
		return this._selectProductsByFilters.selectProductsByFilters(searchParams);
	};

	insertDbFormattedProduct = (product: Product) => {
		return this._insertDbFormattedProduct.insertDBFormattedProduct(product);
	};
}

export default ProductService;

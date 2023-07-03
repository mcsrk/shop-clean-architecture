import { IProductRepository } from '../../entities/product.repository.interface';
import { ISearchParams } from '../../entities/product.interface';

import { SelectProductsByfilters } from './select-products-by-filters';
import { InsertDBFormattedProduct } from './insert-ecommerce-product-db';
import { Product } from '../../entities/product.entity';

export class ProductService {
	private _selectProductsByFilters: SelectProductsByfilters;
	private _insertDbFormattedProduct: InsertDBFormattedProduct;

		this._selectProductsByFilters = new SelectProductsByfilters(productRepository);
	}
	constructor(productRepository: IProductRepository) {
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

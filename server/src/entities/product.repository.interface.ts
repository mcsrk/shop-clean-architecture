// Entities
import { Product } from './product/product.entity';
import { FilterParams } from './filter-params/filter-params.entity';

/** Repository to modify the products */
export interface IProductRepository {
	insertProduct(product: Product): Promise<Product | null>;
	selectProductsByFilters(searchParams: FilterParams): Promise<Product[] | null>;
}

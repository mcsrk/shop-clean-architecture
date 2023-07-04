// Entities
import { Product } from '../../../entities/product/product.entity';
import { FilterParams } from '../../../entities/filter-params/filter-params.entity';

/** Repository to modify the products */
export interface IProductRepository {
	insertProduct(product: Product): Promise<Product | null>;
	selectProductsByFilters(searchParams: FilterParams): Promise<Product[] | null>;
}

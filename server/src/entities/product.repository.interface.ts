import { IProduct } from './product.interface';

// Entities
import { Product } from './product.entity';
import { FilterParams } from './filter-params/filter-params.entity';

/** Repository to modify the products */
export interface IProductRepository {
	insertProduct(product: Product): Promise<IProduct | null>;
	selectProductsByFilters(searchParams: FilterParams): Promise<IProduct[] | null>;
}

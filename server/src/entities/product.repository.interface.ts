import { IProduct, ISearchParams } from './product.interface';
import { Product } from './product.entity';

/** Repository to modify the products */
export interface IProductRepository {
	insertProduct(product: Product): Promise<IProduct | null>;
	selectProductsByFilters(searchParams: ISearchParams): Promise<IProduct[] | null>;
}

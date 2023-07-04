import { Product } from '../product/product.entity';

export interface IECommerceRepository {
	searchProducts(companyPrefix: string, searchTerm: string): Promise<Product[][]>;
}

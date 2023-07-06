import { Product } from '../../../entities/product/product.entity';

export interface IECommerceRepository {
	searchProducts(companyPrefix: string, searchTerm: string): Promise<Product[][]>;
	fetchAllProducts(companyPrefix: string): Promise<Product[][]>;
}

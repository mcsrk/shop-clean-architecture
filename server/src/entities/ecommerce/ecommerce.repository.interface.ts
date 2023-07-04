import { Product } from '../product/product.entity';

export interface IExternalProductRepository {
	searchProducts(companyPrefix: string, searchTerm: string): Promise<Product[][]>;
}

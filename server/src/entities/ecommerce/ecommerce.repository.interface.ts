import { IProduct } from '../product.interface';

export interface IExternalProductRepository {
	searchProducts(companyPrefix: string, searchTerm: string): Promise<IProduct[][]>;
}

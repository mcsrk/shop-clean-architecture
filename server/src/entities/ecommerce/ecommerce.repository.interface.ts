import { IProduct } from '../product.interface';
import { ExternalProductEntity } from './ecommerce.product.interface';

export interface IExternalProductRepository {
	searchProducts(companyPrefix: string, searchTerm: string): Promise<IProduct[][]>;
}

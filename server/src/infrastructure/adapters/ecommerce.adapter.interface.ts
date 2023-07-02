import { IProduct } from '../../entities/product.interface';
import { EcommerceProduct } from './ecommerce.product.interface';

export interface IEcommerceAdapter {
	searchProducts(searchterm: string): Promise<any[]>;
	adaptProduct(externalProduct: any): EcommerceProduct;
	adaptProductToDB(externalProduct: any): IProduct[];
}

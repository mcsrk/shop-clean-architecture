import { IProduct } from '../../entities/product.interface';
import { EcommerceProduct } from './ecommerce.product.interface';

export interface IEcommerceAdapter {
	/**
	 * For a given search term, returns a matrix of IProducts.
	 * Each row is a main product and its parsed variants formatted to IProduct (database structure).
	 *
	 * Note: It is not a flattened array because debugging and readability purposes.
	 *
	 * @param {String} searchterm - String to search product in ecommerce's API's.
	 * @returns {Promise<IProduct[][]>} - Return an array of parsed IProducts array.
	 */
	searchProducts(searchterm: string): Promise<IProduct[][]>;
	adaptProduct(externalProduct: any): EcommerceProduct;
	adaptProductToDB(externalProduct: any): IProduct[];
}

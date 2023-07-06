import { Product } from '../../entities/product/product.entity';

export interface IEcommerceAdapter {
	/**
	 * For a given search term, returns a matrix of typw Product.
	 * Each row is a main product and its parsed variants formatted to type Product (database structure).
	 *
	 * Note: It is not a flattened array because debugging and readability purposes.
	 *
	 * @param {String} searchterm - String to search product in ecommerce's API's.
	 * @returns {Promise<Product[][]>} - Return an array of parsed type Product array.
	 */
	searchProducts(searchterm: string): Promise<Product[][]>;
	fetchAllProducts(eCommerceProduct: any): Promise<Product[][]>;
	adaptProductToDB(eCommerceProduct: any): Product[];
}

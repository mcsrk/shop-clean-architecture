import { IECommerceRepository } from '../../infrastructure/repository/ecommerce/ecommerce.repository.interface';

// Ecommerce use cases
import { SearchEcommerceProducts } from './search-ecommerce-products';
import { FetchAllProducts } from './fetch-all-products';

// Custom library
import Logging from '../../infrastructure/library/Logging';

export class EcommerceService {
	private _searchEcommerceProducts: SearchEcommerceProducts;
	private _fetchAllEcommerceProducts: FetchAllProducts;

	constructor(productRepository: IECommerceRepository) {
		this._searchEcommerceProducts = new SearchEcommerceProducts(productRepository);
		this._fetchAllEcommerceProducts = new FetchAllProducts(productRepository);
	}

	searchProducts = (companyPrefix: string, searchTerm: string) => {
		Logging.info(`[use-cases/ecommerce/] Search products from ${companyPrefix} using the search term :${searchTerm}`);

		return this._searchEcommerceProducts.searchEcommerceProducts(companyPrefix, searchTerm);
	};

	fetchAllEcommerceProducts = (companyPrefix: string) => {
		Logging.info(`[use-cases/ecommerce/] Fetch All Products from ${companyPrefix}`);

		return this._fetchAllEcommerceProducts.fetchAllProducts(companyPrefix);
	};
}

export default EcommerceService;

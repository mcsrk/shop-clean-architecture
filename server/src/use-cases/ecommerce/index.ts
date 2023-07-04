import { IExternalProductRepository } from '../../entities/ecommerce/ecommerce.repository.interface';

// Ecommerce use cases
import { SearchEcommerceProducts } from './search-ecommerce-products';

// Custom library
import Logging from '../../infrastructure/library/Logging';

export class EcommerceService {
	private _searchEcommerceProducts: SearchEcommerceProducts;

	constructor(productRepository: IExternalProductRepository) {
		this._searchEcommerceProducts = new SearchEcommerceProducts(productRepository);
	}

	searchProducts = (companyPrefix: string, searchTerm: string) => {
		Logging.info(`[use-cases/ecommerce/] Search products from ${companyPrefix} using the search term :${searchTerm}`);

		return this._searchEcommerceProducts.searchEcommerceProducts(companyPrefix, searchTerm);
	};
}

export default EcommerceService;

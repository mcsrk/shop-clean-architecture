import { IExternalProductRepository } from '../../entities/ecommerce/ecommerce.repository.interface';
import Logging from '../../infrastructure/library/Logging';
import { SearchEcommerceProducts } from './search-ecommerce-products';

export class EcommerceService {
	private _searchEcommerceProducts: SearchEcommerceProducts;
	constructor(productRepository: IExternalProductRepository) {
		this._searchEcommerceProducts = new SearchEcommerceProducts(productRepository);
	}
	searchProducts = (companyPrefix: string, searchTerm: string) => {
		Logging.info(`[Ecommerce Service Index.ts] Search products from ${companyPrefix} using search term :${searchTerm}`);

		return this._searchEcommerceProducts.searchEcommerceProducts(companyPrefix, searchTerm);
	};
}

export default EcommerceService;

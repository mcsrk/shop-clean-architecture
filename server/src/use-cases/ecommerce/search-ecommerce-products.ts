import { IExternalProductRepository } from '../../entities/ecommerce/ecommerce.repository.interface';
import Logging from '../../infrastructure/library/Logging';

export class SearchEcommerceProducts {
	constructor(private readonly externalProductRepository: IExternalProductRepository) {}

	public searchEcommerceProducts = async (companyPrefix: string, searchTerm: string) => {
		Logging.info(`[List-ecommerce-products] Search products from ${companyPrefix} using search term: ${searchTerm} `);

		return await this.externalProductRepository.searchProducts(companyPrefix, searchTerm);
	};
}

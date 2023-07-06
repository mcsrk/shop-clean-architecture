import { IECommerceRepository } from '../../infrastructure/repository/ecommerce/ecommerce.repository.interface';
import Logging from '../../infrastructure/library/Logging';

export class FetchAllProducts {
	constructor(private readonly eCommerceRepository: IECommerceRepository) {}

	public fetchAllProducts = async (companyPrefix: string) => {
		Logging.info(`[List-ecommerce-products] Fetch All products from ${companyPrefix}`);

		return await this.eCommerceRepository.fetchAllProducts(companyPrefix);
	};
}

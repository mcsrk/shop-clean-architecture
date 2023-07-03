import { IProductRepository } from '../../entities/product.repository.interface';
import { ISearchParams } from '../../entities/product.interface';

export class SelectProductsByfilters {
	/** Shorthand property initialization  */
	constructor(private readonly productRepository: IProductRepository) {}

	public selectProductsByFilters = async (searchParams: ISearchParams) => {
		const products = await this.productRepository.selectProductsByFilters(searchParams);
		return products;
	};
}

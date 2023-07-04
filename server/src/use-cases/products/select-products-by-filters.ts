import { IProductRepository } from '../../entities/product.repository.interface';

// Entities
import { FilterParams } from '../../entities/filter-params/filter-params.entity';

export class SelectProductsByfilters {
	/** Shorthand property initialization  */
	constructor(private readonly productRepository: IProductRepository) {}

	public selectProductsByFilters = async (searchParams: FilterParams) => {
		const products = await this.productRepository.selectProductsByFilters(searchParams);
		return products;
	};
}

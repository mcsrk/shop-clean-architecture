import { IProduct } from '../product.interface';
import { IProductResponse } from './product.response.interface';
import { IVariantResponse } from './variant.response.interface';

import { VariantResponseEntity } from './variant.response.entity';

export class ProductResponseEntity implements IProductResponse {
	/** external_id and sku are the same */
	external_id: string;
	sku: string;
	product_id: string;
	image: string;
	name: string;
	short_description: string;
	long_description: string;
	price: string;
	variants?: IVariantResponse[] | undefined;

	constructor(mainProduct: IProduct) {
		const { variants: productVariants } = mainProduct;

		this.external_id = mainProduct.external_id;
		this.product_id = mainProduct.product_id;
		this.sku = mainProduct.sku;
		this.image = mainProduct.image;
		this.name = mainProduct.name;
		this.short_description = mainProduct.name;
		this.long_description = mainProduct.name;
		this.price = mainProduct?.price.toString() ?? '0';

		const variantsResFormatted = productVariants?.map((variant) => new VariantResponseEntity(mainProduct, variant));
		this.variants = variantsResFormatted ?? [];
	}
}

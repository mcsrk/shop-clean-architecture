import { IVariantResponse } from './variant.response.interface';

export interface IProductResponse {
	/** both are the same */
	external_id: string;
	sku: string;

	product_id: string;
	image: string;
	name: string;
	short_description: string;
	long_description: string;
	price: string;
	variants?: IVariantResponse[] | undefined;
}

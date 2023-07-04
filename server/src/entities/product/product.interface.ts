/** Product to retrieve from own database */
export interface IProduct {
	product_id: string;
	parent_id?: string | null;
	init: boolean;
	external_id: string;
	search_text: string;
	name: string;
	price: number;
	image: string;
	json_product: any;
	sku: string;
	store_product_id: string;

	/** Fileds retrived from database  */
	variants?: any[];

	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

/** Product to create in own database */
export type IProductInput = Omit<IProduct, 'product_id'>;

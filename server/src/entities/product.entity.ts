import { v4 as uuidv4 } from 'uuid';
import { IProduct } from './product.interface';

export class Product implements IProduct {
	product_id: string;
	parent_id: string | null;
	init: boolean;
	external_id: string;
	search_text: string;
	name: string;
	price: number;
	image: string;
	json_product: object;

	// created_at: Date;
	// updated_at: Date;

	sku: string;
	store_product_id: string;

	constructor(product: any) {
		const externalId = product.productId ?? product.id ?? product.external_id;
		const name = product.productName ?? product.title ?? product.name;

		this.product_id = uuidv4();
		this.parent_id = product.parent_id ?? product.parent_id ?? null;
		this.init = product.init ?? true;
		this.external_id = product.external_id ?? externalId?.toString() ?? '';
		this.search_text = product.search_text ?? name;
		this.name = product.name ?? name;
		this.price = product.price ?? Number(product?.items?.sellers?.commertialOffer?.Price ?? product.price ?? 0.0);
		this.image = product.image ?? product?.items?.images?.[0]?.imageUrl ?? product.images?.[0]?.src ?? '';
		this.json_product = product.json_product ?? product;

		// this.created_at = new Date();
		// this.updated_at = new Date();

		this.sku = product.sku ?? product.sku?.toString() ?? externalId.toString() ?? '';
		this.store_product_id = product.store_product_id ?? externalId.toString() ?? '';
	}
}

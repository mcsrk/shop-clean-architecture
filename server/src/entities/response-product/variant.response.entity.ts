// Custom Library
import Logging from '../../infrastructure/library/Logging';

// Interfaces
import { IVariantResponse } from './variant.response.interface';

// Entities
import { Product } from '../product/product.entity';

/** Implemented logic to do certaing format depending of variantdb source */
export class VariantResponseEntity implements IVariantResponse {
	legacyResourceId?: string;
	inventoryQuantity?: number;
	selectedOptions?: any[];
	displayName?: string;
	price?: string;

	constructor(mainProduct: Product, variant: Product) {
		const variantDefaultvalues = {
			legacyResourceId: '',
			inventoryQuantity: 0,
			selectedOptions: [],
			displayName: '',
			price: '',
		};

		if (variant.store_product_id === 'VTEX - MagicStore') {
			const { json_product } = variant;
			if (json_product.sellers.length === 0) {
				Logging.error(`[Variant Response Entity ]Sellers no tiene sellers ${json_product.sellers.length}`);
			}

			const rootSeller = json_product.sellers[0];

			const name = json_product.name;
			const quantity = rootSeller.commertialOffer.AvailableQuantity ?? 0;
			const price = rootSeller.commertialOffer.Price.toString() ?? '0';
			const selectedOptions =
				json_product.referenceId?.map((attr: any) => ({
					name: attr.Key,
					value: attr.Value,
				})) ?? [];

			this.legacyResourceId = variant.external_id;
			this.inventoryQuantity = quantity;
			this.selectedOptions = selectedOptions;
			this.displayName = name;
			this.price = price;
		} else if (variant.store_product_id === 'Shopify - HeavenStore') {
			// Shopify
			const { external_id, name: variant_name, price: variant_price, json_product } = variant;
			const { inventory_quantity: variant_quantity } = json_product;
			const variantAttribute = mainProduct.json_product.options[0].name; // ie: "Size"

			let selectedOptions = [];
			selectedOptions.push({
				name: variantAttribute,
				value: variant_name,
			});

			this.legacyResourceId = external_id;
			this.inventoryQuantity = Number(variant_quantity);
			this.selectedOptions = selectedOptions;
			this.displayName = variant_name;
			this.price = variant_price.toString();
		} else {
			this.legacyResourceId = variantDefaultvalues.legacyResourceId;
			this.inventoryQuantity = variantDefaultvalues.inventoryQuantity;
			this.selectedOptions = variantDefaultvalues.selectedOptions;
			this.displayName = variantDefaultvalues.displayName;
			this.price = variantDefaultvalues.price;
		}
	}
}

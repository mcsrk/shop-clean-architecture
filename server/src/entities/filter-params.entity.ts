import { ISearchParams } from './product.interface';

// Custom library
import Logging from '../infrastructure/library/Logging';

export class FilterParams implements ISearchParams {
	search_text?: string | undefined;
	price?: number | undefined;
	price_operator?: 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | undefined;

	constructor(filterObj: any) {
		// Validation: price_operator es válido? sino lo elimina.
		if (filterObj.price_operator && !['lt', 'lte', 'eq', 'gte', 'gt'].includes(filterObj.price_operator)) {
			Logging.warning(
				`[Filter Params Entity] price_operator has a invalid value: ${filterObj.price_operator}, it'll be ignored.`,
			);
			delete filterObj.price_operator;
		}

		// Validation: price is a valid number or can be a valid number?
		if (filterObj.price === '') {
			Logging.warning(`[Filter Params Entity] price has a invalid value, it'll be ignored.`);
			delete filterObj.price;
		}
		if (filterObj.price && (isNaN(filterObj.price) || isNaN(Number(filterObj.price)))) {
			Logging.warning(`[Filter Params Entity] price has a invalid value: ${filterObj.price}, it'll be ignored.`);
			delete filterObj.price;
		}

		this.search_text = filterObj.search_text;
		this.price = filterObj.price;
		this.price_operator = filterObj.price_operator;
	}
}

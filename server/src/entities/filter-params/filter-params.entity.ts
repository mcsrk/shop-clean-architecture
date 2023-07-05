// Custom library
import Logging from '../../infrastructure/library/Logging';

import { IFilterParams } from './filter-params.interface';

export class FilterParams implements IFilterParams {
	search_text?: string | undefined;
	price?: number | undefined;
	price_operator?: 'lt' | 'lte' | 'eq' | 'gte' | 'gt' | undefined;

	constructor(filterObj: any) {
		/** Validation: is operator_price valid? otherwise delete it*/
		if (filterObj.price_operator && !['lt', 'lte', 'eq', 'gte', 'gt'].includes(filterObj.price_operator)) {
			Logging.warning(
				`[Filter Params Entity] price_operator has a invalid value: ${filterObj.price_operator}, it'll be ignored.`,
			);
			delete filterObj.price_operator;
		}

		/** Validation: is price a valid number or can be parsed into a valid number? otherwise delete it. */
		if (filterObj.price === '' || filterObj.price === '0') {
			Logging.warning(`[Filter Params Entity] price has a invalid value, it'll be ignored.`);
			delete filterObj.price;
		}
		if (filterObj.price && (isNaN(filterObj.price) || isNaN(Number(filterObj.price)))) {
			Logging.warning(
				`[Filter Params Entity] price could not be converted into a valid number: ${filterObj.price}, it'll be ignored.`,
			);
			delete filterObj.price;
		}

		this.search_text = filterObj.search_text;
		this.price = filterObj.price;
		this.price_operator = filterObj.price_operator;
	}
}

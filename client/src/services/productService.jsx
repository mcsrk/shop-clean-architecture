import { createRequest, throwErrors } from './globalService';

export const getProducts = async ({ search, price, priceOperator }) => {
	try {
		const response = await createRequest().get(`/products`, {
			params: {
				search_text: search,
				price: price,
				price_operator: priceOperator,
			},
		});
		return response.data.result.items;
	} catch (e) {
		return throwErrors(e);
	}
};

export const searchEcommerceProducts = async ({ companyPrefix, search }) => {
	try {
		const response = await createRequest().get(`search/${companyPrefix}`, {
			params: {
				search_text: search,
			},
		});
		return response.data;
	} catch (e) {
		return throwErrors(e);
	}
};

import { createRequest, throwErrors } from './globalService';

export const getProducts = async ({ search_text, price, price_operator }) => {
	try {
		const response = await createRequest().get(`/products`, {
			params: {
				search_text,
				price,
				price_operator,
			},
		});
		return response.data.result.items;
	} catch (e) {
		return throwErrors(e);
	}
};

export const searchEcommerceProducts = async ({ companyPrefix, search_text }) => {
	try {
		const response = await createRequest().get(`search/${companyPrefix}`, {
			params: {
				search_text,
			},
		});
		return response.data;
	} catch (e) {
		return throwErrors(e);
	}
};

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	search_text: '',
	price: 0,
	price_operator: '',
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setSearchText: (state, action) => {
			state.search_text = action.payload;
		},
		setPrice: (state, action) => {
			state.price = Number(action.payload);
		},
		setPriceOperator: (state, action) => {
			state.price_operator = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setSearchText, setPrice, setPriceOperator } = filtersSlice.actions;

export default filtersSlice.reducer;

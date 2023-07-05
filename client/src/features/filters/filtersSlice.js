import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	search_text: '',
	price: null,
	price_operator: null,
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		setSearchText: (state, action) => {
			state.search_text = action.payload;
		},
		setPrice: (state, action) => {
			state.price = action.payload;
		},
		setPriceOperator: (state, action) => {
			state.price_operator = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { setSearchText, setPrice, setPriceOperator } = filtersSlice.actions;

export default filtersSlice.reducer;

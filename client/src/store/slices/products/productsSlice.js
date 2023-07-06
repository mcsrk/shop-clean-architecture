import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	products: [],
	loading: false,
	error: null,
};

export const productsSlice = createSlice({
	name: 'products',
	initialState,
	reducers: {
		toggleLoading: (state) => {
			state.loading = !state.loading;
		},
		setProducts: (state, action) => {
			state.products = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleLoading, setProducts, setError } = productsSlice.actions;

export default productsSlice.reducer;

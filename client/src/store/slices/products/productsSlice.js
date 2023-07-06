import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	products: [],
	loading: false,
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
	},
});

// Action creators are generated for each case reducer function
export const { toggleLoading, setProducts } = productsSlice.actions;

export default productsSlice.reducer;

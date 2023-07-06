import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	products: [],
	loading: false,
	status: null,
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
		setStatus: (state, action) => {
			state.status = action.payload;
		},
		setError: (state, action) => {
			state.error = action.payload;
		},
	},
});

// Action creators are generated for each case reducer function
export const { toggleLoading, setProducts, setStatus, setError } = productsSlice.actions;

export default productsSlice.reducer;

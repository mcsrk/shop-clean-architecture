import { configureStore } from '@reduxjs/toolkit';

// Reducers
import filtersReducer from './slices/filters/filtersSlice';
import productsReducer from './slices/products/productsSlice';

export const store = configureStore({
	reducer: {
		filters: filtersReducer,
		products: productsReducer,
	},
});

import { configureStore } from '@reduxjs/toolkit';

// Reducers
import filtersReducer from '../features/filters/filtersSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
	reducer: {
		filters: filtersReducer,
		products: productsReducer,
	},
});

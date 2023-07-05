import { useRef, useState, useCallback } from 'react';

// Redux Toolkit
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, toggleLoading } from '../features/products/productsSlice.js';

// Services
import { getProducts, searchEcommerceProducts } from '../services/productService.js';

export function useProducts(filters) {
	const dispatch = useDispatch();

	// Retrieve global state variables
	const products = useSelector((state) => state.products.products);
	const loading = useSelector((state) => state.products.loading);

	// el error no se usa pero puedes implementarlo
	// si quieres:
	const [, setError] = useState(null);
	const previousSearch = useRef(filters);

	const fetchProducts = useCallback(async (_filters) => {
		const { search_text } = _filters;

		try {
			dispatch(toggleLoading());
			setError(null);

			previousSearch.current = _filters;

			await searchEcommerceProducts({ companyPrefix: 'HeavenStore', search_text });
			const newProducts = await getProducts(_filters);

			dispatch(setProducts(newProducts));
		} catch (e) {
			setError(e.message);
		} finally {
			dispatch(toggleLoading());
		}
	}, []);

	// const sortedProducts = useMemo(() => {
	// 	return [...products].sort((a, b) => a.name.localeCompare(b.name));
	// }, [products]);

	return {
		fetchProducts,
		products,
		// products: sortedProducts,
		loading,
	};
}

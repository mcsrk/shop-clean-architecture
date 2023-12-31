import { useRef, useCallback, useMemo } from 'react';

// Redux Toolkit
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, toggleLoading, setStatus, setError } from '../store/slices/products/productsSlice';

// Services
import { getProducts, searchEcommerceProducts } from '../services/productService.js';
import { AVAILABLE_STORES } from '../config';

export function useProducts(filters) {
	const dispatch = useDispatch();

	// Retrieve global state variables
	const products = useSelector((state) => state.products.products);
	const loading = useSelector((state) => state.products.loading);
	const status = useSelector((state) => state.products.status);
	const error = useSelector((state) => state.products.error);

	const previousSearch = useRef(filters);

	const fetchProducts = useCallback(
		async (_filters) => {
			const { search_text, price, price_operator } = _filters;
			const { current } = previousSearch;
			/** Dont excecute the query if is useless*/

			const onSearchTextChange = search_text !== current.search_text;

			const shouldExecuteQuery =
				onSearchTextChange ||
				(price !== current.price && price >= 0 && price_operator !== '') ||
				(price_operator !== current.price_operator && price >= 0);
			if (!shouldExecuteQuery) return;

			try {
				dispatch(toggleLoading());
				dispatch(setError(null));
				previousSearch.current = _filters;

				/** Only request Ecommerce search when search term has changed.
				 *  Because server only uses search_tem to query on externals apis */
				if (onSearchTextChange) {
					const ecommercePromises = [];
					const shopNames = Object.values(AVAILABLE_STORES).flat();

					for (const shop of shopNames) {
						ecommercePromises.push(searchEcommerceProducts({ companyPrefix: shop ?? '', search_text }));
					}

					try {
						dispatch(setStatus('Consultando tiendas...'));
						await Promise.all(ecommercePromises);
					} catch (e) {
						dispatch(setError(e.message));
					}
				}

				dispatch(setStatus('Buscando productos...'));
				const newProducts = await getProducts(_filters);

				dispatch(setStatus(newProducts.length ? null : `Sin productos para : "${search_text}"`));
				dispatch(setProducts(newProducts));
			} catch (e) {
				dispatch(setError(e.message));
			} finally {
				dispatch(toggleLoading());
			}
		},
		[dispatch],
	);

	const sortedProducts = useMemo(() => {
		return [...products].sort((a, b) => a.name.localeCompare(b.name));
	}, [products]);

	return {
		fetchProducts,
		products: sortedProducts,
		loading,
		status,
		error,
	};
}

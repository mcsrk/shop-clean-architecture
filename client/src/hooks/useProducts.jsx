import { useRef, useState, useMemo, useCallback } from 'react';

// Services
import { getProducts, searchEcommerceProducts } from '../services/productService.jsx';

export function useProducts({ search, price, price_operator }) {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(false);
	// el error no se usa pero puedes implementarlo
	// si quieres:
	const [, setError] = useState(null);
	const previousSearch = useRef({ search, price, price_operator });

	const fetchProducts = useCallback(async ({ search, price, price_operator }) => {
		if (search === previousSearch.current) return;

		try {
			setLoading(true);
			setError(null);

			previousSearch.current = { search, price, price_operator };

			await searchEcommerceProducts({ companyPrefix: 'HeavenStore', search });
			const newProducts = await getProducts({ search, price, price_operator });

			setProducts(newProducts);
		} catch (e) {
			setError(e.message);
		} finally {
			setLoading(false);
		}
	}, []);

	const sortedProducts = useMemo(() => {
		return [...products].sort((a, b) => a.name.localeCompare(b.name));
	}, [products]);

	return { products: sortedProducts, fetchProducts, loading };
}

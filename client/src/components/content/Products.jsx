import { useEffect } from 'react';

// Styles
import './Products.css';

// Hooks
import { useProducts } from '../../hooks/useProducts';
import { useFilters } from '../../hooks/useFilters';

// Components
import { ProductCard } from './ProductCard';
import Error from '../error/Error';
import Status from './Status';

export function Products() {
	const { filters } = useFilters();
	const { products, fetchProducts, error } = useProducts(filters);

	useEffect(() => {
		fetchProducts(filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	return (
		<section className="products">
			<Status />
			<ul>
				{products?.map((product) => {
					return <ProductCard key={`product-card-${product.product_id}`} product={product} />;
				})}
			</ul>
			<Error message={error} />
		</section>
	);
}

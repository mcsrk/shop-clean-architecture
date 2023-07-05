import { useEffect } from 'react';

// Styles
import './Products.css';

// Hooks
import { useProducts } from '../../hooks/useProducts';
import { useFilters } from '../../hooks/useFilters';

// Components
import { ProductCard } from './ProductCard';

export function Products() {
	const { filters } = useFilters();
	const { products, loading, fetchProducts } = useProducts(filters);

	useEffect(() => {
		fetchProducts(filters);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filters]);

	return (
		<section className="products">
			{loading.toString()}
			<ul>
				{products?.map((product) => {
					return <ProductCard key={`product-card-${product.product_id}`} product={product} />;
				})}
			</ul>
		</section>
	);
}

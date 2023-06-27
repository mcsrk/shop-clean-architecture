import './Products.css';
import PropTypes from 'prop-types';

import { ProductCard } from './ProductCard';

export function Products({ products }) {
	return (
		<section className="products">
			<ul>
				{products.slice(0, 10).map((product) => {
					// const isProductInCart = checkProductInCart(product);
					return <ProductCard key={`product-card-${product.product_id}`} product={product} />;
				})}
			</ul>
		</section>
	);
}

Products.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			product_id: PropTypes.number.isRequired,
			name: PropTypes.string.isRequired,
			price: PropTypes.number.isRequired,
			description: PropTypes.string.isRequired,
			category: PropTypes.string.isRequired,
			image: PropTypes.string.isRequired,
			thumbnail: PropTypes.string.isRequired,
		}),
	).isRequired,
};

import './ProductCard.css';
import PropTypes from 'prop-types';

export function ProductCard({ product }) {
	const { thumbnail, name, price } = product;
	return (
		<li className="product-card">
			<img src={thumbnail} alt={name} />
			<div className="info">
				<p>
					<span className="category">{name.split(' ', 1)}</span>
				</p>
				<p className="name">{name}</p>
				<p>
					<strong className="price">${price}</strong>
				</p>
			</div>
			<div className="actions">
				<button>Seleccionar</button>
			</div>
		</li>
	);
}

ProductCard.propTypes = {
	product: PropTypes.shape({
		product_id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
		price: PropTypes.number.isRequired,
		description: PropTypes.string.isRequired,
		category: PropTypes.string.isRequired,
		thumbnail: PropTypes.string.isRequired,
	}).isRequired,
};

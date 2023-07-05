import PropTypes from 'prop-types';

//Styles
import './ProductCard.css';

// Utils
import { addThousandSeparators } from '../../utils/stringManipulator';

export function ProductCard({ product }) {
	const { image, name, price } = product;
	const category = name.split(' ', 1);

	return (
		<li className="product-card">
			<img src={image} alt={name} />
			<div className="card-block">
				<div className="info">
					<p>
						<span className="category">{category}</span>
					</p>
					<p className="name">{name}</p>
					<p>
						<strong className="price">${addThousandSeparators(price)}</strong>
					</p>
				</div>
				<div className="actions">
					<button>Seleccionar</button>
				</div>
			</div>
		</li>
	);
}

ProductCard.propTypes = {
	product: PropTypes.shape({
		product_id: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		price: PropTypes.string.isRequired,
		short_description: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
	}).isRequired,
};

import { useId } from 'react';
import { AiOutlineShop } from 'react-icons/ai';

// Styles
import './Filters.css';

// Components
import SearchBar from './SearchBar';

// Hooks
import { useFilters } from '../../../hooks/useFilters';

export function Filters() {
	const { filters, setFilterPrice } = useFilters();

	/** useId Hook to generate an unique Id for input and label all over the App */
	const priceFilterId = useId();

	const handleChangePrice = (event) => {
		setFilterPrice(event.target.value);
	};

	return (
		<section className="filters">
			<SearchBar />
			<p className="extra-action">
				¿Aún no te decides? <span>BÚSCALO EN LA TIENDA AQUÍ</span>
				{' >'}
				<button className="shop-button">
					<AiOutlineShop className="icon" />
				</button>
			</p>

			<div>
				<label htmlFor={priceFilterId}>Precio: </label>
				<input type="range" id={priceFilterId} min="0" max="1000" onChange={handleChangePrice} value={filters.price} />
				<span>${filters.price}</span>
			</div>
		</section>
	);
}

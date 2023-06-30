import { useId } from 'react';

// Styles
import './Filters.css';

// Components
import SearchBar from './SearchBar';

// Hooks
import { useFilters } from '../../../hooks/useFilters.js';

export function Filters() {
	const { filters, setFilters } = useFilters();

	/** useId Hook to generate an unique Id for input and label all over the App */

	const minPriceFilterId = useId();
	const categoryFilterId = useId();

	const handleChangeMinPrice = (event) => {
		setFilters((prevState) => ({
			...prevState,
			minPrice: event.target.value,
		}));
	};

	const handleChangeCategory = (event) => {
		// ⬇️ ESTO HUELE MAL
		// estamos pasando la función de actualizar estado
		// nativa de React a un componente hijo
		setFilters((prevState) => ({
			...prevState,
			category: event.target.value,
		}));
	};

	return (
		<section className="filters">
			<SearchBar />
			<div>
				<label htmlFor={categoryFilterId}>Categoría</label>
				<select id={categoryFilterId} onChange={handleChangeCategory}>
					<option value="all">Todas</option>
					<option value="laptops">Portátiles</option>
					<option value="smartphones">Celulares</option>
				</select>
			</div>

			<div>
				<label htmlFor={minPriceFilterId}>Precio a partir de:</label>
				<input
					type="range"
					id={minPriceFilterId}
					min="0"
					max="1000"
					onChange={handleChangeMinPrice}
					value={filters.minPrice}
				/>
				<span>${filters.minPrice}</span>
			</div>

			<h4>
				¿Aún no te decides? <span>BÚSCALO EN LA TIENDA AQUÍ {'>'}</span>
			</h4>
		</section>
	);
}

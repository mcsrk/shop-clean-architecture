import { AiOutlineShop } from 'react-icons/ai';

// Styles
import './Filters.css';

// Components
import SearchBar from './SearchBar';
import PriceFilter from './PriceFilter';

export function Filters() {
	/** useId Hook to generate an unique Id for input and label all over the App */

	return (
		<section className="filters">
			<SearchBar /> <PriceFilter />
			<div className="extra-action">
				<div>
					<p>¿Aún no te decides?</p>
				</div>
				<div>
					<span> BÚSCALO EN LA TIENDA AQUÍ</span>
					{' >'}
					<button className="shop-button">
						<AiOutlineShop className="icon" />
					</button>
				</div>
			</div>
		</section>
	);
}

// Styles
import './Header.css';

// Hooks
import { Filters } from './filters/Filters';

export function Header() {
	return (
		<header>
			<h1>
				E-commerce Unificado <img src="shop-logo.png" alt="Shopping cart icon" />
			</h1>
			<Filters />
		</header>
	);
}

// Config
import { IS_DEVELOPMENT } from '../../config';

// Hooks
import { useFilters } from '../../hooks/useFilters';

// Styles
import './Footer.css';

export function Footer() {
	const { filters } = useFilters();

	return (
		<footer className="footer">
			<div>
				<img src="shop-logo.png" alt="Shopping cart icon" />
				<h4>E-commerce unificado </h4>
				<h5>
					<span>Jhon Acosta</span>
				</h5>
			</div>

			{IS_DEVELOPMENT && <div className="debug">{JSON.stringify(filters)}</div>}
		</footer>
	);
}

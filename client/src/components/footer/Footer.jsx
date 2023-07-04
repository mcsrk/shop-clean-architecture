import { useFilters } from '../../hooks/useFilters';
import './Footer.css';

export function Footer() {
	const { filters } = useFilters();

	return (
		<footer className="footer">
			<div>
				<img src="shop-logo.png" alt="Shopping cart icon" />
				<h4>E-commerce unificado </h4>
			</div>

			<h5>
				<span>Jhon Acosta</span>
			</h5>
			<div>{JSON.stringify(filters)}</div>
		</footer>
	);
}

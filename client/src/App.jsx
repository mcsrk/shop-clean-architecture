import './App.css';
import { products as initialProducts } from './mocks/products.json';

// Config
import { IS_DEVELOPMENT } from './config.js';

// Hooks
import { useFilters } from './hooks/useFilters.js';

// Components
import { Header } from './components/header/Header';
import { Products } from './components/content/Products';
import { Footer } from './components/footer/Footer.jsx';

function App() {
	const { filterProducts } = useFilters();

	const filteredProducts = filterProducts(initialProducts);
	return (
		<>
			<Header />
			<main>
				<Products products={filteredProducts} />
			</main>
			{IS_DEVELOPMENT && <Footer />}
		</>
	);
}

export default App;

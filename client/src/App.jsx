import './App.css';

// Config

// Components
import { Header } from './components/header/Header';
import { Products } from './components/content/Products';
import { Footer } from './components/footer/Footer.jsx';

function App() {
	return (
		<>
			<Header />
			<main>
				<Products />
			</main>
			<Footer />
		</>
	);
}

export default App;

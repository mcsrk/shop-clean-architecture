import ReactDOM from 'react-dom/client';
import './index.css';

//Components
import App from './App';

// Context
import { FiltersProvider } from './context/filters.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<FiltersProvider>
		<App />
	</FiltersProvider>,
);

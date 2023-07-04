import { useId, useState } from 'react';
import { useFilters } from '../../../hooks/useFilters';
import { AiOutlineLoading3Quarters, AiOutlineSearch } from 'react-icons/ai';

// Styles
import './SearchBar.css';

const SearchBar = () => {
	const { filters, setFilters } = useFilters();
	const [isLoading, setIsLoading] = useState(false);

	const searchFilterId = useId();
	const handlechangeSearch = (event) => {
		setFilters((prevState) => ({
			...prevState,
			searchTerm: event.target.value,
		}));
	};

	return (
		<div className="search-container">
			<label htmlFor={searchFilterId}>Busca lo que quieras y cámbialo fácilemente</label>
			<div className="input-wrapper">
				<input
					type="text"
					id={searchFilterId}
					value={filters.searchTerm}
					onChange={handlechangeSearch}
					placeholder="Busca un producto"
					title="Escribe el nombre de un producto"
				/>

				{isLoading ? (
					<span className="loading" role="status">
						<AiOutlineLoading3Quarters />
					</span>
				) : (
					<span className="search-icon">
						<AiOutlineSearch />
					</span>
				)}
			</div>
		</div>
	);
};

export default SearchBar;

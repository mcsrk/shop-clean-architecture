import { useId, useState } from 'react';
import { AiOutlineLoading3Quarters, AiOutlineSearch } from 'react-icons/ai';
import { useDebouncedCallback } from 'use-debounce';

// Config
import { DEBOUNCE_DELAY } from '../../../config';

// Styles
import './SearchBar.css';

// Hooks
import { useFilters } from '../../../hooks/useFilters';

const SearchBar = () => {
	const { setFilters } = useFilters();
	const [isLoading, setIsLoading] = useState(false);
	const [value, setValue] = useState('');

	const searchFilterId = useId();

	const handleChangeSearch = (event) => {
		setIsLoading(true);
		setValue(event.target.value);
		debounced(event.target.value);
	};

	const debounced = useDebouncedCallback((typedValue) => {
		setFilters((prevState) => ({
			...prevState,
			searchTerm: typedValue,
		}));
		setIsLoading(false);
	}, DEBOUNCE_DELAY);

	return (
		<div className="search-container">
			<label htmlFor={searchFilterId}>Busca lo que quieras y cámbialo fácilemente</label>
			<div className="input-wrapper">
				<input
					type="text"
					id={searchFilterId}
					value={value}
					onChange={handleChangeSearch}
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

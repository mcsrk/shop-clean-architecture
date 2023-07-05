import { createContext, useState } from 'react';
import PropTypes from 'prop-types';
export const FiltersContext = createContext();

export function FiltersProvider({ children }) {
	const [filters, setFilters] = useState({
		searchTerm: '',
		category: 'all',
		minPrice: 250,
	});

	return (
		<FiltersContext.Provider
			value={{
				filters,
				setFilters,
			}}
		>
			{children}
		</FiltersContext.Provider>
	);
}
FiltersProvider.propTypes = {
	children: PropTypes.node,
};

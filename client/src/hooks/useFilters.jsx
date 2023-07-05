import { useContext } from 'react';
import { FiltersContext } from '../context/filters.jsx';

export function useFilters() {
	const { filters, setFilters } = useContext(FiltersContext);

	return {
		filters,
		setFilters,
	};
}

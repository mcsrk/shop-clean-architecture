import { useDispatch, useSelector } from 'react-redux';
import { setSearchText, setPrice, setPriceOperator } from '../store/slices/filters/filtersSlice';

export function useFilters() {
	const filters = useSelector((state) => state.filters);
	const dispatch = useDispatch();

	// TODO: Validación de datos como trim y etc
	const setFilterSearchText = (search_text) => dispatch(setSearchText(search_text.trim()));
	const setFilterPrice = (price) => dispatch(setPrice(price));
	const setFilterPriceOperator = (price_operator) => dispatch(setPriceOperator(price_operator));

	return {
		filters,
		setFilterSearchText,
		setFilterPrice,
		setFilterPriceOperator,
	};
}

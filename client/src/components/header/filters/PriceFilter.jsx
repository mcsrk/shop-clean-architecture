import { useId, useState } from 'react';
import { FaGreaterThanEqual, FaLessThanEqual, FaEquals } from 'react-icons/fa';
import { BsCurrencyDollar } from 'react-icons/bs';
import { useDebouncedCallback } from 'use-debounce';

// Config
import { DEBOUNCE_DELAY } from '../../../config';

// Styles
import './PriceFilter.css';

// Hooks
import { useFilters } from '../../../hooks/useFilters';
import { useProducts } from '../../../hooks/useProducts';

const PriceFilter = () => {
	const { filters, setFilterPrice, setFilterPriceOperator } = useFilters();
	const { loading } = useProducts();

	const priceFilterId = useId();

	const selectButtonLess = useId();
	const selectButtonEqual = useId();
	const selectButtonGreater = useId();
	const selectButtonNA = useId();

	const [priceValue, setPriceValue] = useState('');

	const handleChangeSearch = (event) => {
		setPriceValue(event.target.value);
		debounced(event.target.value);
	};

	const debounced = useDebouncedCallback((priceValue) => {
		setFilterPrice(priceValue);
	}, DEBOUNCE_DELAY);

	const onOptionChange = (e) => {
		setFilterPriceOperator(e.target.value);
	};

	return (
		<>
			<div className="price-container">
				<div className="input-wrapper">
					<span className="currency-icon">
						<BsCurrencyDollar />
					</span>

					<input
						disabled={loading}
						type="text"
						id={priceFilterId}
						value={priceValue}
						onChange={handleChangeSearch}
						placeholder="Filtra por precio"
						title="Precio"
					/>
				</div>
				<div className="radio-group">
					<input
						disabled={loading}
						type="radio"
						id={selectButtonLess}
						name="size"
						value="lte"
						checked={filters.price_operator === 'lte'}
						onChange={onOptionChange}
					/>
					<label htmlFor={selectButtonLess}>
						<FaLessThanEqual />
					</label>

					<input
						disabled={loading}
						type="radio"
						id={selectButtonEqual}
						name="size"
						value="eq"
						checked={filters.price_operator === 'eq'}
						onChange={onOptionChange}
					/>
					<label htmlFor={selectButtonEqual}>
						<FaEquals />
					</label>

					<input
						disabled={loading}
						type="radio"
						id={selectButtonGreater}
						name="size"
						value="gte"
						checked={filters.price_operator === 'gte'}
						onChange={onOptionChange}
					/>
					<label htmlFor={selectButtonGreater}>
						<FaGreaterThanEqual />
					</label>
					<input
						disabled={loading}
						className="price-op-na"
						type="radio"
						id={selectButtonNA}
						name="size"
						value=""
						checked={filters.price_operator === ''}
						onChange={onOptionChange}
					/>
					<label className="price-op-na" htmlFor={selectButtonNA}>
						N/A
					</label>
				</div>
			</div>
		</>
	);
};

export default PriceFilter;

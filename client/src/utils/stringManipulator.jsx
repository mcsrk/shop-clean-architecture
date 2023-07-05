export const addThousandSeparators = (numberString) => {
	if (!numberString || typeof numberString !== 'string') {
		return '';
	}

	const parts = numberString.split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');

	return parts.join('.');
};

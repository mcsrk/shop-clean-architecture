import PropTypes from 'prop-types';

// Styles
import './Error.css';

const Error = ({ message }) => {
	return <div className={`error-message ${message ? 'show' : ''}`}>Error: {message}</div>;
};

Error.propTypes = {
	message: PropTypes.string,
};

export default Error;

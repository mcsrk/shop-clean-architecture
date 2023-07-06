import { useProducts } from '../../hooks/useProducts';

// Styles
import './Status.css';

const Status = () => {
	const { status } = useProducts();
	return <div className={`status-message ${status ? 'show' : ''}`}>{status}</div>;
};

export default Status;

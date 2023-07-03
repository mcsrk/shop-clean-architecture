import Logging from '../library/Logging';
import ProductModel from './product.model';

export async function syncModels() {
	try {
		/** Sync all the models involved */
		await ProductModel.sync({ alter: true });
		console.clear();
	} catch (error: any) {
		Logging.error(error);
	}
}

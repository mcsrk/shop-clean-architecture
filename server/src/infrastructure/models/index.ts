// Custom library
import Logging from '../library/Logging';

// Models
import ProductModel from './product.model';

export async function syncModels() {
	try {
		/** Sync all the models involved */
		await ProductModel.sync({ alter: true });
		ProductModel.associate();
	} catch (error: any) {
		Logging.error(error);
	}
}

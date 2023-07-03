import express from 'express';
import http from 'http';

// Custom modules
import Logging from './infrastructure/library/Logging';

// Config
import { CONFIG } from './infrastructure/config/config';

// Infrastructure
import { makeDatabase } from './infrastructure/database/database';
import { syncModels } from './infrastructure/models/models';

// Routes
import productRoutes from './routes/product.routes';
import customRoute from './routes/product.route';
import externalProductRoute from './routes/ecommerce.route';

const router = express();
makeDatabase()
	.then(() => {
		Logging.setup('PostgresSQL connected successfully.');
		/** If PostgresSQl is connected, the server will be up and running */
		StartServer();
	})
	.catch((error: any) => Logging.error(error));

syncModels()
	.then(() => Logging.setup('Models have been synchronized'))
	.catch((error: any) => Logging.error(error));

/** Only Start Server if Database is connected */
const StartServer = () => {
	/** Log the request */
	router.use((req, res, next) => {
		/** Log the req */
		Logging.info(`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`);

		res.on('finish', () => {
			/** Log the res on request finished event */
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
			);
		});

		next();
	});

	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());

	/** Rules of our API */
	router.use((req, res, next) => {
		/** Requests from anywhere */
		res.header('Access-Control-Allow-Origin', '*');
		/** Headers allowed to use */
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		/** All of the options that can be used in this API */
		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});

	/** Routes */
	router.use('/search', productRoutes);
	router.use('/ecommerce', externalProductRoute);
	router.use('/changeThisRoute', customRoute);

	/** Healthcheck endpoint */
	router.get('/ping', (req, res, next) => res.status(200).json({ hello: 'world' }));

	/** Error handling on wrong Route */
	router.use((req, res, next) => {
		const error = new Error('API Route Not found');

		Logging.error(error);

		res.status(404).json({
			message: error.message,
		});
	});

	http
		.createServer(router)
		.listen(CONFIG.SERVER.PORT, () => Logging.info(`Server is running on port ${CONFIG.SERVER.PORT}`));
};

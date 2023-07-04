import express, { NextFunction, Request, Response } from 'express';
import http from 'http';

// Custom modules
import Logging from './infrastructure/library/Logging';

// Config
import { CONFIG } from './infrastructure/config/config';

// Infrastructure
import { makeDatabase } from './infrastructure/database/database';
import { syncModels } from './infrastructure/models';

// Routes
import productRoute from './routes/product.routes';

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
	router.use((req: Request, res: Response, next: NextFunction) => {
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
			res.header('Access-Control-Allow-Methods', 'GET');
			return res.status(200).json({});
		}

		next();
	});

	/** Routes */
	router.use('/search', productRoute);

	/** Healthcheck endpoint */
	router.get('/ping', (_, res: Response) => res.status(200).json({ hello: 'world' }));

	/** Error handling on wrong Route */
	router.use((req: Request, res: Response) => {
		const error = new Error(`API Route Not found: [${req.method}] ${req.url}`);

		Logging.error(error);

		res.status(404).json({
			message: error.message,
		});
	});

	http
		.createServer(router)
		.listen(CONFIG.SERVER.PORT, () => Logging.info(`Server is running on port ${CONFIG.SERVER.PORT}`));
};

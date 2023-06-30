import dotenv from 'dotenv';

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 8000;

/** PostgresSQL - Database */

const DB_HOST = process.env.DB_HOST || '';
const DB_DATABASE = process.env.DB_DATABASE || '';
const DB_USER = process.env.DB_USER || '';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_PORT = process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432;

/** Shopify - E-commerce */

const SHOPIFY_API_KEY = process.env.SHOPIFY_API_KEY || '';
const SHOPIFY_PASSWORD = process.env.SHOPIFY_PASSWORD || '';
const SHOPIFY_SHOP_NAME = process.env.SHOPIFY_SHOP_NAME || '';
const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || '';

/** Vtex - E-commerce */
const VTEX_STORE = process.env.VTEX_STORE || '';
const VTEX_APP_KEY = process.env.VTEX_APP_KEY || '';
const VTEX_APP_TOKEN = process.env.VTEX_APP_TOKEN || '';
const VTEX_ACCOUNT_NAME = process.env.VTEX_ACCOUNT_NAME || '';
const VTEX_ENVIROMENT = process.env.VTEX_ENVIROMENT || '';
const VTEX_PAYMENT_SYSTEM = process.env.VTEX_PAYMENT_SYSTEM || '';

export const CONFIG = Object.freeze({
	SERVER: {
		PORT: SERVER_PORT,
	},
	POSTGRESSQL: {
		HOST: DB_HOST,
		DATABASE: DB_DATABASE,
		USER: DB_USER,
		PASSWORD: DB_PASSWORD,
		PORT: DB_PORT,
	},
	SHOPIFY: {
		APIKEY: SHOPIFY_API_KEY,
		PASSWORD: SHOPIFY_PASSWORD,
		SHOP_NAME: SHOPIFY_SHOP_NAME,
		API_VERSION: SHOPIFY_API_VERSION,
	},
	VTEX: {
		STORE: VTEX_STORE,
		APP_KEY: VTEX_APP_KEY,
		APP_TOKEN: VTEX_APP_TOKEN,
		ACCOUNT_NAME: VTEX_ACCOUNT_NAME,
		ENVIROMENT: VTEX_ENVIROMENT,
		PAYMENT_SYSTEM: VTEX_PAYMENT_SYSTEM,
	},
});

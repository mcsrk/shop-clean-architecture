import { Sequelize } from 'sequelize-typescript';
import { CONFIG } from '../config/config';

export const sequelize = new Sequelize(
	CONFIG.POSTGRESSQL.DATABASE,
	CONFIG.POSTGRESSQL.USER,
	CONFIG.POSTGRESSQL.PASSWORD,
	{
		logging: false,

		dialect: 'postgres',
		host: CONFIG.POSTGRESSQL.HOST,
		port: CONFIG.POSTGRESSQL.PORT,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
		dialectOptions: {
			ssl: {
				rejectUnauthorized: true, // Ensure SSL is enabled
				ciphers: 'TLS_AES_256_GCM_SHA384', // Choose an appropriate cipher suite
			},
		},
	},
);

export async function makeDatabase() {
	await sequelize.authenticate();
}

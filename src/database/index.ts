import 'dotenv/config';
import { Pool } from 'pg';

const conectionPool = new Pool({
	connectionString: process.env.URL_DATABASE,
	ssl: {
		rejectUnauthorized: false,
	},
});

export class Database {
	public static async query(sql: string, params?: any[]) {
		const client = await conectionPool.connect();
		const result = await client.query(sql, params);

		client.release();

		return result;
	}
}

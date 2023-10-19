import {Pool} from 'pg';
import pgvector from 'pgvector/pg';

const pool = new Pool({
    user: process.env.POSTGRES_USER as string,
    host: process.env.POSTGRES_HOST as string,
    database: process.env.POSTGRES_DB as string,
    password: process.env.POSTGRES_PASSWORD as string,
    port: Number(process.env.POSTGRES_PORT),
    max: 20,
});
pool.on('connect', async function (client) {
    await pgvector.registerType(client);
});
export const query = async (queryString: string, params: string[]): Promise<any> => {
    try {
        const res = await pool.query(queryString, params);
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
}

export const insert = async (insertString: string, params: any[]): Promise<any> => {
    try {
        const res = await pool.query(insertString, params);
        return res;
    } catch (e) {
        console.log(e);
        throw e;
    }
}
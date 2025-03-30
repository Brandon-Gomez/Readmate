import 'dotenv/config';
import pg from 'pg'

const { Pool } = pg
const connectionString = process.env.DB_URL

export const db = new Pool ({
    allowExitOnIdle: true,
    connectionString
})

const connectDB = async () => {
    try {
        await db.query('SELECT NOW()');
        console.log('DATABASE CONNECTED')
    } catch (error) {
        console.log('DATABASE CONNECTION ERROR',error)
    }
};

connectDB();
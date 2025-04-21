import pg from 'pg';
import dotenv from 'dotenv';

const { Pool } = pg;
dotenv.config();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });

export async function checkDatabaseExists(dbName) {
  const client = await pool.connect();
  try {
    const res = await client.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [dbName]
    );

    const exists = res.rowCount > 0;
    console.log(`БД "${dbName}" ${exists ? 'существует' : 'не найдена'}.`);
    return exists;
  } catch (err) {
    console.error('Ошибка при проверке базы данных:', err);
    return false;
  } finally {
    client.release();
  }
}


export async function createDatabase(dbName) {
    const client = await systemPool.connect();
    try {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ База данных "${dbName}" успешно создана.`);
    } catch (err) {
      console.error('Ошибка при создании БД:', err);
    } finally {
      client.release();
    }
  }




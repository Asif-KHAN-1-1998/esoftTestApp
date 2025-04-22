
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

export async function initTables() {
  const client = await pool.connect();
  try {
    // 1. Создание таблицы users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        middle_name TEXT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        manager_id INTEGER REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // 2. Создание таблицы todos
    await client.query(`
      CREATE TABLE IF NOT EXISTS todos (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        due_date DATE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        priority TEXT CHECK (priority IN ('низкий', 'средний', 'высокий')) NOT NULL,
        status TEXT CHECK (status IN ('к выполнению', 'выполняется', 'выполнена', 'отменена')) NOT NULL,
        creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        assignee_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        creator_first_name TEXT,
        creator_last_name TEXT,
        assignee_first_name TEXT,
        assignee_last_name TEXT
      )
    `);

    console.log('Таблицы "users" и "todos" готовы.');

    // 3. Вставка тестовых данных в таблицу users
    await client.query(`
      INSERT INTO users (first_name, last_name, middle_name, username, password)
      VALUES 
      ('Иван', 'Иванов', 'Иванович', 'ivan_ivanov', 'password123'),
      ('Мария', 'Петрова', 'Сергеевна', 'maria_pet', 'password456'),
      ('Олег', 'Сидоров', 'Анатольевич', 'oleg_sidorov', 'password789')
      ON CONFLICT (username) DO NOTHING;
    `);

    // 4. Вставка тестовых данных в таблицу todos
    await client.query(`
      INSERT INTO todos (title, description, due_date, priority, status, creator_id, assignee_id, creator_first_name, creator_last_name, assignee_first_name, assignee_last_name)
      VALUES 
      ('Задача 1', 'Описание задачи 1', '2025-05-01', 'высокий', 'к выполнению', 1, 2, 'Иван', 'Иванов', 'Мария', 'Петрова'),
      ('Задача 2', 'Описание задачи 2', '2025-06-01', 'средний', 'выполняется', 2, 3, 'Мария', 'Петрова', 'Олег', 'Сидоров'),
      ('Задача 3', 'Описание задачи 3', '2025-07-01', 'низкий', 'выполнена', 3, 1, 'Олег', 'Сидоров', 'Иван', 'Иванов')
      ON CONFLICT (title) DO NOTHING;
    `);

    console.log(' Тестовые данные успешно добавлены.');
  } catch (err) {
    console.error('Ошибка при инициализации таблиц и добавлении тестовых данных:', err);
  } finally {
    client.release();
  }
}

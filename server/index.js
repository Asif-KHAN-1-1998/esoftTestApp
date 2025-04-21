import argon2 from 'argon2'; 
import dotenv from 'dotenv';
import express from 'express';
import pg from 'pg';
const { Pool } = pg;
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { authenticateToken } from './middleware.js';
import {initTables} from './addTables.js';



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Тудушки

app.post('/api/todos', authenticateToken, async (req, res) => {
 
  const { title, description, due_date, priority, status, creator_id, assignee_id } = req.body;

  try {
    const result = await pool.query(
      `
      INSERT INTO todos (
        title,
        description,
        due_date,
        created_at,
        updated_at,
        priority,
        status,
        creator_id,
        assignee_id
      ) VALUES ($1, $2, $3, NOW(), NOW(), $4, $5, $6, $7)
      RETURNING *;
      `,
      [title, description, due_date, priority, status, creator_id, assignee_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при создании задачи:', err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.get('/api/todos', authenticateToken, async (req, res) => {
  await initTables()
  try {
    const result = await pool.query(`
      SELECT 
        t.id,
        t.title,
        t.description,
        t.due_date,
        t.created_at,
        t.updated_at,
        t.priority,
        t.status,
        t.creator_id,
        t.assignee_id,
        c.first_name AS creator_first_name,
        c.last_name AS creator_last_name,
        a.first_name AS assignee_first_name,
        a.last_name AS assignee_last_name
      FROM todos t
      LEFT JOIN users c ON t.creator_id = c.id
      LEFT JOIN users a ON t.assignee_id = a.id;
  `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.delete('/api/todos/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query(
      `
      DELETE FROM todos WHERE id = $1;
      `,
      [id]
    );
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

app.patch('/api/todos/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, priority, status, assignee_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE todos
        SET title = COALESCE($1, title), description = COALESCE($2, description), due_date = COALESCE($3, due_date), priority = COALESCE($4, priority), status = COALESCE($5, status), assignee_id = COALESCE($6, assignee_id), updated_at = NOW()
        WHERE id = $7`,
      [title, description, due_date, priority, status, assignee_id, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Задача не найдена');
    }

    res.send('Задача частично обновлена');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

//Пользователи
app.get(`/api/users`, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT t.id,
      t.first_name,
      t.last_name,
      t.middle_name,
      t.username,
      t.password,
      t.manager_id,
      c.first_name AS creator_first_name,
      c.last_name AS creator_last_name
      FROM users t
      LEFT JOIN users c ON t.manager_id = c.id
        `
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
});

app.post('/api/users/register', async (req, res) => {
  await initTables()
  const { first_name, last_name, middle_name, username, password, manager_id } = req.body;
  try {
    const hashedPassword = await argon2.hash(password);
    const result = await pool.query(
      `INSERT INTO users (
        first_name,
        last_name,
        middle_name,
        username,
        password,
        manager_id
      ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [first_name, last_name, middle_name, username, hashedPassword, manager_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    res.status(500).json({ error: 'Ошибка при регистрации пользователя', message: err.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  await initTables()
  const { username, password } = req.body;
  try {
    const result = await pool.query(
      `SELECT id, username, password FROM users WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (!result.rows.length) {
      return res.status(401).json({ error: 'Пользователь не найден' });
    }
    const validPassword = await argon2.verify(user.password, password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Неверный пароль' });
    }
    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET);

    res.status(200).json({ token, user });
  } catch (err) {
    console.error('Ошибка при авторизации:', err);
    res.status(500).json({ error: 'Ошибка при авторизации' });
  }
});


app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

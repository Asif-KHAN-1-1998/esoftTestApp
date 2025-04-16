// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Пример маршрута
app.get('/api/users', async (req, res) => {
    try {
      const result = await pool.query(`
        SELECT 
          u.id,
          u.first_name AS user_first_name,
          u.last_name AS user_last_name,
          u.manager_id AS manager_id,
          u.username AS username
        FROM users u
        LEFT JOIN users m ON u.manager_id = m.id
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
  
  app.post('/api/todos', async (req, res) => {
    const {
      title,
      description,
      due_date,
      priority,
      status,
      creator_id,
      assignee_id
    } = req.body;
  
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


  app.get('/api/todos', async (req, res) => {
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
          t.assignee_id
        FROM todos t
      `);
      res.json(result.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  });
// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
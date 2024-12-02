const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const createTable = async () => {
  const createQuery = `
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `;
  await pool.query(createQuery);
};
createTable();

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Database Error' });
  }
});

// POST /tasks - Add a new task
app.post('/tasks', async (req, res) => {
  const { description, status } = req.body;
  if (!description || !status) {
    return res
      .status(400)
      .json({ error: 'All fields (description, status) are required' });
  }
  try {
    await pool.query(
      'INSERT INTO tasks (description, status) VALUES ($1, $2)',
      [description, status]
    );
    res.status(201).json({ message: 'Task added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database Error' });
  }
});

// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { status } = req.body;

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, taskId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database Error' });
  }
});
// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING *',
      [taskId]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Database Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const { pool } = require('pg');
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
    const createQuery = 
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status TEXT NOT NULL
    )
    ;
    await pool.query(createQuery);
};
createTable();

let tasks = [
  { id: 1, description: 'Buy groceries', status: 'incomplete' },
  { id: 2, description: 'Read a book', status: 'complete' },
];

// GET /tasks - Get all tasks
app.get('/tasks', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM tasks');
        res.json(tasks);
    } catch (error) {
res.status(500).json({error: 'Database Error'});
    }
  
});

// POST /tasks - Add a new task
app.post('/tasks', async (request, response) => {
  const { description, status } = request.body;
  if ( !description || !status) {
    return response
      .status(400)
      .json({ error: 'All fields (description, status) are required' });
  }
   try {
    await pool.query('INSERT INTO tasks (description, status) VALUE($1, $2)'),[description, status];
    res.status(201).json({ message: 'Task added successfully' });
   } catch (error){
    res.status(201).json({error: 'Database Error'});
   }

});

// PUT /tasks/:id - Update a task's status
app.put('/tasks/:id', (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const { status } = request.body;
  const task = tasks.find((t) => t.id === taskId);

  if (!task) {
    return response.status(404).json({ error: 'Task not found' });
  }
  task.status = status;
  response.json({ message: 'Task updated successfully' });
});

// DELETE /tasks/:id - Delete a task
app.delete('/tasks/:id', (request, response) => {
  const taskId = parseInt(request.params.id, 10);
  const initialLength = tasks.length;
  tasks = tasks.filter((t) => t.id !== taskId);

  if (tasks.length === initialLength) {
    return response.status(404).json({ error: 'Task not found' });
  }
  response.json({ message: 'Task deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

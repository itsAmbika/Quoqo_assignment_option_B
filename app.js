const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const path = require('path');
const ejsMate = require('ejs-mate');
const { randomUUID } = require('crypto');

const app = express();
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

app.get('/', (req, res) => {
  res.redirect('/requests');
});

// form to create a new request
app.get('/requests/new', async (req, res) => {
  try {
    const [users] = await db.query(`
      SELECT id, name, role
      FROM users
      ORDER BY name
    `);

    res.render('new', {
      title: 'New Request',
      users,
    });
  } catch (error) {
    console.error('Error loading new request form:', error);
    res.status(500).send('Unable to load request form');
  }
});

// create a new request
app.post('/requests', async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    return res.status(400).send('Title and user are required');
  }

  try {
    const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);

    if (users.length === 0) {
      return res.status(400).send('Selected user does not exist');
    }

    const requestId = randomUUID();

    await db.query(
      'INSERT INTO requests (id, title, description, userId) VALUES (?, ?, ?, ?)',
      [requestId, title.trim(), description?.trim() || null, userId]
    );

    res.redirect('/requests');
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).send('Unable to create request');
  }
});

// read all requests
app.get('/requests', async (req, res) => {
  try {
    const [requests] = await db.query(`
      SELECT
        requests.id,
        requests.title,
        requests.description,
        requests.status,
        requests.createdAt,
        requests.updatedAt,
        users.name AS createdBy,
        users.email AS userEmail,
        users.role AS userRole
      FROM requests
      JOIN users ON requests.userId = users.id
      ORDER BY requests.createdAt DESC
    `);

    res.render('requests', {
      title: 'Workflow Requests',
      requests,
    });
  } catch (error) {
    console.error('Error fetching requests:', error);
    res.status(500).send('Unable to load requests');
  }
});

// form to edit a request
app.get('/requests/:id/edit', async (req, res) => {
  try {
    const [[request]] = await db.query(
      'SELECT id, title, description, status, userId FROM requests WHERE id = ?',
      [req.params.id]
    );

    if (!request) {
      return res.status(404).send('Request not found');
    }

    const [users] = await db.query(`
      SELECT id, name, role
      FROM users
      ORDER BY name
    `);

    res.render('edit', {
      title: 'Edit Request',
      request,
      users,
      statuses: ['pending', 'in_review', 'approved', 'rejected', 'completed'],
    });
  } catch (error) {
    console.error('Error loading edit request form:', error);
    res.status(500).send('Unable to load edit request form');
  }
});

// update a request
app.post('/requests/:id/edit', async (req, res) => {
  const { title, description, status, userId } = req.body;

  try {
    await db.query(
      `
        UPDATE requests
        SET title = ?, description = ?, status = ?, userId = ?
        WHERE id = ?
      `,
      [title.trim(), description?.trim() || null, status, userId, req.params.id]
    );

    res.redirect('/requests');
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).send('Unable to update request');
  }
});

// delete a request
app.post('/requests/:id/delete', async (req, res) => {
  try {
    await db.query('DELETE FROM requests WHERE id = ?', [req.params.id]);

    res.redirect('/requests');
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).send('Unable to delete request');
  }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

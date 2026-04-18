const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const path = require('path');
const ejsMate = require('ejs-mate');

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



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

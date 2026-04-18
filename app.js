const express = require('express');
require('dotenv').config();
const mysql = require('mysql2/promise');
const path = require('path');
const ejsMate = require('ejs-mate');
const { randomUUID } = require('crypto');
const wrapAsync = require('./utils/wrapasync');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const bcrypt = require('bcryptjs');


const auth = require('./utils/auth');




const app = express();
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


 app.use(session({
     secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-prod',
     resave: false,
     saveUninitialized: false,
     cookie: { 
     secure: process.env.NODE_ENV === 'production',
     maxAge: 24 * 60 * 60 * 1000  // 24 hours
   }
 }));
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.session = req.session || {};
  res.locals.alerts = { error: [] };
  next();
});



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

// ===== AUTH ROUTES (using modular utils/auth.js) =====
// Login GET - show form (public)
app.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});










app.post('/login', wrapAsync(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase() || '';
  const password = req.body.password || '';
  const [[user]] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
  if (user && await bcrypt.compare(password, user.password)) {
    auth.loginUser(user)(req);
    const returnTo = req.session.returnTo || '/requests';
    delete req.session.returnTo;
    return req.session.save((err) => {
      if (err) {
        return res.status(500).render('error', { title: 'Error', error: 'Unable to start your session' });
      }
      res.redirect(returnTo);
    });
  } else {
    res.locals.alerts.error.push('Invalid email/password');
    res.status(401).render('login', { title: 'Login', formData: { email } });
  }
}));

// Logout POST - clear session
app.post('/logout', (req, res) => {
  auth.logoutUser(req, res);
});

// ===== PROTECTED ROUTES =====
// form to create a new request (requires login)
app.get('/requests/new',  auth.isLoggedIn,  wrapAsync(async (req, res) => {
  const [users] = await db.query(`
    SELECT id, name, role
    FROM users
    ORDER BY name
  `);

  res.render('new', {
    title: 'New Request',
    users,
  });
}));

// create a new request
app.post('/requests', auth.isLoggedIn, wrapAsync(async (req, res) => {
  const { title, description, userId } = req.body;

  if (!title || !userId) {
    throw new ExpressError(400, 'Title and user are required');
  }

  const [users] = await db.query('SELECT id FROM users WHERE id = ?', [userId]);

  if (users.length === 0) {
    throw new ExpressError(400, 'Selected user does not exist');
  }

  const requestId = randomUUID();

  await db.query(
    'INSERT INTO requests (id, title, description, userId) VALUES (?, ?, ?, ?)',
    [requestId, title.trim(), description?.trim() || null, userId]
  );

  res.redirect('/requests');
}));

// read all requests
app.get('/requests', wrapAsync(async (req, res) => {
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
}));

// form to edit a request
app.get('/requests/:id/edit', auth.isLoggedIn, auth.requireRole('admin', 'manager'), wrapAsync(async (req, res) => {
  const [[request]] = await db.query(
    'SELECT id, title, description, status, userId FROM requests WHERE id = ?',
    [req.params.id]
  );

  if (!request) {
    throw new ExpressError(404, 'Request not found');
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
}));

// update a request
app.post('/requests/:id/edit', auth.isLoggedIn, auth.requireRole('admin', 'manager'),  wrapAsync(async (req, res) => {
  const { title, description, status, userId } = req.body;

  await db.query(
    `
      UPDATE requests
      SET title = ?, description = ?, status = ?, userId = ?
      WHERE id = ?
    `,
    [title.trim(), description?.trim() || null, status, userId, req.params.id]
  );

  res.redirect('/requests');
}));

// delete a request
app.post('/requests/:id/delete', auth.isLoggedIn, auth.requireRole('admin'), wrapAsync(async (req, res) => {
  await db.query('DELETE FROM requests WHERE id = ?', [req.params.id]);

  res.redirect('/requests');
}));



app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  let status = 500;
  let message = process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message;
  if (err instanceof ExpressError) {
    status = err.status;
    message = err.message;
  }
  // Set alerts for EJS
  res.locals.alerts = res.locals.alerts || {};
  res.locals.alerts.error = res.locals.alerts.error || [];
  res.locals.alerts.error.push(message);
  res.status(status).render('error', { title: 'Error', error: message });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

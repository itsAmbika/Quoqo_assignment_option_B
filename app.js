const express = require('express');
const path = require('path');
const session = require('express-session');
const ejsMate = require('ejs-mate');

require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const requestRoutes = require('./routes/requestRoutes');
const { attachLocals } = require('./middleware/locals');
const { handleError } = require('./controllers/errorController');

const app = express();
const port = process.env.PORT || 3000;

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
}));
app.use(attachLocals);

app.get('/', (req, res) => {
  res.redirect('/requests');
});

app.use(authRoutes);
app.use('/requests', requestRoutes);

app.use(handleError);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

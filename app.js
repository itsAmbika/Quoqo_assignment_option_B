const express = require('express');
const path = require('path');
const session = require('express-session');
const ejsMate = require('ejs-mate');
const routes = require('./routes');
const { attachLocals } = require('./middleware/locals');
const { handleError } = require('./controllers/errorController');
const { ROUTES, SESSION_CONFIG } = require('./constants/appConstants');

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(SESSION_CONFIG));
app.use(attachLocals);

app.get('/', (req, res) => {
  res.redirect(ROUTES.requests);
});

app.use(routes);

app.use(handleError);

module.exports = app;

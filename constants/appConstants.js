const REQUEST_STATUSES = ['pending', 'in_review', 'approved', 'rejected', 'completed'];

const ROUTES = {
  home: '/',
  login: '/login',
  logout: '/logout',
  requests: '/requests',
  newRequest: '/new',
  editRequest: '/:id/edit',
  deleteRequest: '/:id/delete',
};

const VIEW_TITLES = {
  login: 'Login',
  requests: 'Workflow Requests',
  newRequest: 'New Request',
  editRequest: 'Edit Request',
  error: 'Error',
};

const ALERT_MESSAGES = {
  invalidCredentials: 'Invalid email/password',
  invalidRequestInput: 'Title and user are required',
  invalidRequestUser: 'Selected user does not exist',
  requestNotFound: 'Request not found',
  sessionStartFailed: 'Unable to start your session',
  internalServerError: 'Internal Server Error',
};

const SESSION_CONFIG = {
  secret: process.env.SESSION_SECRET || 'your-super-secret-key-change-in-prod',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
};

module.exports = {
  ALERT_MESSAGES,
  REQUEST_STATUSES,
  ROUTES,
  SESSION_CONFIG,
  VIEW_TITLES,
};

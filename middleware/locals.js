exports.attachLocals = (req, res, next) => {
  res.locals.session = req.session || {};
  res.locals.alerts = { error: [] };
  next();
};

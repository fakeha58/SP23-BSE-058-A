// Authentication middleware
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error_msg', 'Please log in to access this page');
    return res.redirect('/auth/login');
  }
  next();
};

// Redirect if already authenticated
const redirectIfAuth = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/user/dashboard');
  }
  next();
};

// Admin middleware (for future use)
const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    req.flash('error_msg', 'Access denied. Admin privileges required.');
    return res.redirect('/');
  }
  next();
};

module.exports = {
  requireAuth,
  redirectIfAuth,
  requireAdmin
};
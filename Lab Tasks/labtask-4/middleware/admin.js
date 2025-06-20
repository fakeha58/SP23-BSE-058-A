module.exports = function(req, res, next) {
  if (req.session.user && req.session.user.isAdmin) return next();
  req.flash('error_msg', 'Admins only');
  res.redirect('/auth/login');
};
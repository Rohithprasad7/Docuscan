function isAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    return res.status(403).send('Access denied');
  }
  
  module.exports = { isAdmin };
  
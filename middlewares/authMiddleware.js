// middlewares/authMiddleware.js
const authMiddleware = (req, res, next) => {
  if (req.session.authUser) {
    return next();
  } else {
    return res.redirect('/login');
  }
};

module.exports = authMiddleware;
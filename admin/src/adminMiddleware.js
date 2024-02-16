// adminMiddleware.js

const requireAuth = (req, res, next) => {
  // Check if req.session exists and if loggedIn property exists
  if (req.session && req.session.loggedIn) {
    // User is authenticated, proceed to the next middleware
    next();
  } else {
    // User is not authenticated, redirect to login page
    res.redirect('/login');
  }
};

module.exports = { requireAuth };

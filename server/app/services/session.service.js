const session = require('express-session');

function configureSession() {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  });
}

module.exports = configureSession();
require("dotenv").config();

// Initialization
const express = require('express')
const app = express()
const db = require('./app/models')
const cors = require('cors')
const session = require('express-session')

// CORS
var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}))

// Database synchronization
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

// Routes
// require("./app/routes/irs.routes")(app);
// require("./app/routes/profil.routes")(app);
// require("./app/routes/pkl.routes")(app);
// require("./app/routes/auth.routes")(app);
// require("./app/routes/user.routes")(app);
// require("./app/routes/khs.routes")(app);
// require("./app/routes/skripsi.routes")(app);

// Start server
app.listen((process.env.APP_PORT || 8080), () => {
  console.log(`Server started on http://localhost:${process.env.APP_PORT}`)
});
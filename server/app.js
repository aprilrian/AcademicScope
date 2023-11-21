require("dotenv").config();

// Initialization
const express = require('express')
const { db, initializeData } = require('./app/models')
const app = express()
const cors = require('./app/services/cors.service')
const session = require('./app/services/session.service')

// CORS
app.use(cors)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session
app.use(session)

// Database synchronization
db.sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Error synchronizing database:', err);
  });

// Database initialization
initializeData();

// Routes
app.use('/', require('./app/routes/user.routes'));
// require("./app/routes/irs.routes")(app);
// require("./app/routes/profil.routes")(app);
// require("./app/routes/pkl.routes")(app);
// require("./app/routes/auth.routes")(app);
// require("./app/routes/user.routes")(app);
// require("./app/routes/khs.routes")(app);
// require("./app/routes/skripsi.routes")(app);

// Start server
app.listen((process.env.SERVER_PORT || 8080), () => {
  console.log(`Server started on http://localhost:${process.env.SERVER_PORT}`)
});
require("dotenv").config();

// Initialization
const express = require('express')

const app = express()
const db = require('./app/models')
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

// Routes
// require("./app/routes/irs.routes")(app);
// require("./app/routes/profil.routes")(app);
// require("./app/routes/pkl.routes")(app);
// require("./app/routes/auth.routes")(app);
// require("./app/routes/user.routes")(app);
// require("./app/routes/khs.routes")(app);
// require("./app/routes/skripsi.routes")(app);

// Start server
app.listen((process.env.APP_PORT || 3000), () => {
  console.log(`Server started on http://localhost:${process.env.APP_PORT}`)
});
// Initialization
require("dotenv").config();

const express = require('express')
const app = express()
const { db, initializeData } = require('./app/models')
const multerUpload = require('./app/services/multer.service');

// Using services
app.use(multerUpload)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database synchronization
// db.sequelize.sync({ alter: true, force: false })
//   .then(() => {
//     console.log('\nDatabase synchronized');
//   })
//   .catch((err) => {
//     console.error('\nError synchronizing database:', err);
//   });

// Database initialization
initializeData();

// Routes
app.use('/auth', require('./app/routes/auth.routes'));
app.use('/user', require('./app/routes/user.routes'));

// Start server
app.listen((process.env.SERVER_PORT || 8080), () => {
  console.log(`Server started on http://localhost:${process.env.SERVER_PORT}`)
});
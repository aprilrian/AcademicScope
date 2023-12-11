// Initialization
require("dotenv").config();

const express = require('express')
const app = express()
const { db, initializeData } = require('./app/models')
const corsConfig = require("./app/configs/cors.config");

// Using services
app.use(corsConfig);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database synchronization
// db.sequelize.sync({ alter: true, force: false }).then(() => {
//   console.log('Drop and re-sync db.');
// });

// Database initialization
initializeData();

// Routes
app.use('/', require('./app/routes/user.routes'));
app.use('/auth', require('./app/routes/auth.routes'));
app.use('/kabupatenKota', require('./app/routes/kabupatenKota.routes'));
app.use('/provinsi', require('./app/routes/provinsi.routes'));
app.use('/uploads', express.static('uploads'));

// Start server
app.listen((process.env.SERVER_PORT || 8080), () => {
  console.log(`Server started on http://localhost:${process.env.SERVER_PORT}`)
});
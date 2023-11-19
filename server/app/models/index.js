const { Sequelize } = require('sequelize');
const sequelize = require('../configs/db.config');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.mahasiswa = require("./mahasiswa.model");
db.dosen = require("./dosen.model");
db.user = require("./user.model");

module.exports = db;
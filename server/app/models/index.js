const { Sequelize } = require('sequelize');
const sequelize = require('../configs/db.config');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.mahasiswa = require("./Mahasiswa.model");
db.dosen = require("./Dosen.model");
db.user = require("./User.model");
db.KabupatenKota = require("./KabupatenKota.model");    
db.provinsi = require("./Provinsi.model");
db.role = require("./Role.model");
db.status = require("./Status.model");
db.angkatan = require("./Angkatan.model");
db.jalurMasuk = require("./JalurMasuk.model");

module.exports = db;
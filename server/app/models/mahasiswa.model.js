// MahasiswaModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const User = require('./user.model');
const Dosen = require('./dosen.model');

const Mahasiswa = sequelize.define('Mahasiswa', {
  nim: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  angkatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'Aktif',
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  alamat: {
    type: DataTypes.STRING,
  },
  nomor_telepon: {
    type: DataTypes.STRING,
  },
  dosen_wali: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jalur_masuk: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });
Mahasiswa.belongsTo(Dosen, { foreignKey: 'dosen_wali' });


module.exports = Mahasiswa;

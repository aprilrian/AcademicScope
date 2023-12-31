// models/irs.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const IRS = sequelize.define('IRS', {
  mahasiswa_nim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester_aktif: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Semester aktif wajib diisi',
    },
  },
  sks: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Jumlah SKS wajib diisi',
    },
  },
  file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan IRS',
    },
  },
  status_verifikasi: {
    type: DataTypes.ENUM('belum', 'sudah'),
    defaultValue: 'belum',
  },
}, {
  tableName: 'IRSs',
});

IRS.beforeSave(async (irs, options) => {
  irs.sks = irs.sks.toString();
});

module.exports = IRS;

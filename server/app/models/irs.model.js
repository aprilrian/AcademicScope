// models/irs.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const Mahasiswa = require('./Mahasiswa.model');

const IRS = sequelize.define('IRS', {
  mahasiswa_nim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester_aktif: {
    type: DataTypes.INTEGER,
    allowNull: {
      args: false,
      msg: 'Semester aktif wajib diisi',
    },
    validate: {
      isInt: {
        msg: 'Semester aktif harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Semester aktif dalam rentang 1-14',
      },
      max: {
        args: [14],
        msg: 'Semester aktif dalam rentang 1-14',
      },
    },
  },
  sks: {
    type: DataTypes.INTEGER,
    allowNull: {
      args: false,
      msg: 'Jumlah SKS wajib diisi',
    },
    validate: {
      isInt: {
        msg: 'Jumlah SKS harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Jumlah SKS minimal 1 SKS',
      },
      max: {
        args: [24],
        msg: 'Jumlah SKS maksimal 24 SKS',
      },
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
    type: DataTypes.ENUM('belum', 'sedang diverifikasi' ,'sudah'),
    defaultValue: 'belum',
  },
}, {
  tableName: 'IRSs',
});

module.exports = IRS;

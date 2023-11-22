const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const PKL = sequelize.define('PKL', {
  status: {
    type: DataTypes.ENUM('belum', 'sedang pkl', 'lulus'),
    allowNull: {
      args: false,
      msg: 'Status wajib diisi',
    },
  },
  nilai: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'Nilai harus berupa angka',
      },
      min: {
        args: [0],
        msg: 'Nilai dalam rentang 0-100',
      },
      max: {
        args: [100],
        msg: 'Nilai dalam rentang 0-100',
      },
    },
  },
  semester: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: {
        msg: 'Semester harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Semester dalam rentang 1-14',
      },
      max: {
        args: [14],
        msg: 'Semester dalam rentang 1-14',
      },
    },
    defaultValue: 6,
  },
  status_verifikasi: {
    type: DataTypes.ENUM('belum', 'sedang diverifikasi', 'sudah'),
    defaultValue: 'belum',
  },

  pkl_file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan berita acara seminar PKL',
    },
  },
});

module.exports = PKL;

const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const PKL = sequelize.define('PKL', {
  mahasiswa_nim: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
    },
  },
  status: {
    type: DataTypes.ENUM('belum_ambil', 'lulus'),
    allowNull: {
      args: false,
      msg: 'Status wajib diisi',
    },
  },
  nilai: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  semester: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status_verifikasi: {
    type: DataTypes.ENUM('belum', 'sudah'),
    defaultValue: 'belum',
  },
  file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan berita acara seminar PKL',
    },
  },

  
});

PKL.beforeSave(async (pkl, options) => {
  pkl.nilai = pkl.nilai.toString();
  pkl.semester = pkl.semester.toString();
});

module.exports = PKL;

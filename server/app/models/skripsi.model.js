const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Skripsi = sequelize.define('Skripsi', {
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
    allowNull: true,
  },
  tanggal_lulus: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Tanggal lulus harus berupa tanggal',
      },
    },
  },
  tanggal_sidang: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    validate: {
      isDate: {
        msg: 'Tanggal sidang harus berupa tanggal',
      },
    },
  },
  lama_studi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status_verifikasi: {
    type: DataTypes.ENUM('belum', 'sudah'),
    defaultValue: 'belum',
  },
  file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan berita acara sidang skripsi',
    },
  },
});

Skripsi.beforeSave(async (skripsi, options) => {
  skripsi.nilai = skripsi.nilai.toString();
  skripsi.semester = skripsi.semester.toString();
  skripsi.lama_studi = skripsi.lama_studi.toString();
});

module.exports = Skripsi;


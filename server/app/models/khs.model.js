const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const KHS = sequelize.define('KHS', {
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

  sks_kumulatif: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Jumlah SKS kumulatif wajib diisi',
    },
  },

  ip: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'IP wajib diisi',
    },
  },

  ip_kumulatif: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'IP kumulatif wajib diisi',
    },
  },

  status_verifikasi: {
    type: DataTypes.ENUM('belum' ,'sudah'),
    defaultValue: 'belum',
  },

  file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan KHS',
    },
  },

}, {
  tableName: 'KHSs'
});

KHS.beforeSave(async (khs, options) => {
  khs.sks = khs.sks.toString();
  khs.sks_kumulatif = khs.sks_kumulatif.toString();
  khs.ip = khs.ip.toString();
  khs.ip_kumulatif = khs.ip_kumulatif.toString();
});

module.exports = KHS;

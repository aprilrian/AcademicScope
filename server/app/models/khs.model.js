const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const KHS = sequelize.define('KHS', {
  semesterAktif: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Semester aktif wajib diisi' },
      max: { args: [1], msg: 'Semester aktif maksimal 1 karakter' },
    },
  },
  sks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'SKS harus diisi' },
      max: { args: [2], msg: 'SKS maksimal 2 karakter' },
    },
  },
  sksKumulatif: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'SKS kumulatif wajib diisi' },
      max: { args: [3], msg: 'SKS kumulatif maksimal 3 karakter' },
    },
  },
  ip: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'IP harus diisi' },
      max: { args: [3], msg: 'IP maksimal 3 karakter' },
    },
  },
  ipKumulatif: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notNull: { msg: 'IP kumulatif harus diisi' },
      max: { args: [3], msg: 'IP kumulatif maksimal 3 karakter' },
    },
  },
  statusKonfirmasi: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      max: { args: [20], msg: 'Status konfirmasi maksimal 20 karakter' },
    },
  },
  file: {
    type: DataTypes.STRING,
    allowNull: true,
    // Jika ingin membuat validasi untuk file, Anda dapat menambahkannya di sini
  },
});

module.exports = KHS;

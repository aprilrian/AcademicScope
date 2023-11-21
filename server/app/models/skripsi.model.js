const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Skripsi = sequelize.define('Skripsi', {
  nilai: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Nilai wajib diisi' },
      max: { args: [1], msg: 'Nilai maksimal 1 karakter' },
    },
  },
  tanggal: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: 'Tanggal harus diisi' },
    },
  },
  semester: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: 'Semester harus diisi' },
    },
  },
  statusKonfirmasi: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: { msg: 'Status konfirmasi harus diisi' },
    },
  },
  file: {
    type: DataTypes.STRING,
    // Jika ingin membuat validasi untuk file, Anda dapat menambahkannya di sini
  },
});

module.exports = Skripsi;


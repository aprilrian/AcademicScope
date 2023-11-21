// models/irs.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const IRS = sequelize.define('IRS', {
  semesterAktif: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Semester aktif wajib diisi',
      },
      isInt: {
        msg: 'Semester aktif harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Semester aktif minimal 1',
      },
      max: {
        args: [99],
        msg: 'Semester aktif maksimal 99',
      },
    },
  },
  sks: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'SKS wajib diisi',
      },
      isInt: {
        msg: 'SKS harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'SKS minimal 1',
      },
      max: {
        args: [99],
        msg: 'SKS maksimal 99',
      },
    },
  },
  file: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notNull: {
        msg: 'Upload wajib diisi',
      },
    },
  },
  statusKonfirmasi: {
    type: DataTypes.ENUM('belum', 'sudah'),
    defaultValue: 'belum',
  },
});

module.exports = IRS;

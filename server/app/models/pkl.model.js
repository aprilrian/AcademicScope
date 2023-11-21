const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const PKL = sequelize.define('PKL', {
  nilai: {
    type: DataTypes.STRING,
    validate: {
      len: [1, 1],
    },
  },
  semester: {
    type: DataTypes.INTEGER,
    validate: {
      max: 2,
    },
  },
  statusKonfirmasi: {
    type: DataTypes.STRING,
    validate: {
      max: 20,
    },
  },
  file: {
    type: DataTypes.STRING,
    // Tambahkan validasi jika diperlukan, misalnya:
    // validate: {
    //   len: [1, 100],
    // },
  },
});

module.exports = PKL;

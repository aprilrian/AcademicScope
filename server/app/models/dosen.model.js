// DosenModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const User = require('./User.model');

const Dosen = sequelize.define('Dosen', {
  nip: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  address: {
    type: DataTypes.STRING,
  },
  phone_number: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Dosen.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Dosen;

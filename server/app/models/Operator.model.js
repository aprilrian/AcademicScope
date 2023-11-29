// DosenModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const User = require('./User.model');

const Operator = sequelize.define('Operator', {
  nip: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  alamat: {
    type: DataTypes.STRING,
  },
  phone: {
    type: DataTypes.STRING,
  },
  foto: {
    type: DataTypes.STRING,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Operator.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Operator;

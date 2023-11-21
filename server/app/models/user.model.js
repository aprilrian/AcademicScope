// UserModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const Role = require('./Role.model');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

User.beforeCreate(async (user, options) => {
  if (options && options.individualHooks === false) {
    return;
  }
  const salt = await bcrypt.genSaltSync();
  user.password = await bcrypt.hashSync(user.password, salt);
});

User.belongsTo(Role, { foreignKey: 'role' });

module.exports = User;

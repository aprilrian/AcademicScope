// UserModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
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
    allowNull: {
      args: false,
      msg: 'Username wajib diisi',
    },
    unique: {
      args: true,
      msg: 'Username sudah terdaftar',
    },
  },
  email: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'Email sudah terdaftar',
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Password wajib diisi',
    },
  },
  role: {
    type: DataTypes.ENUM('operator', 'mahasiswa', 'dosen', 'departemen'),
    allowNull: {
      args: false,
      msg: 'Role wajib diisi',
    },
  },
  access_token: {
    type: DataTypes.STRING(1000),
  }
});

User.beforeCreate(async (user, options) => {
  if (options && options.individualHooks === false) {
    return;
  }
  const salt = await bcrypt.genSaltSync();
  user.password = await bcrypt.hashSync(user.password, salt);
});

module.exports = User;

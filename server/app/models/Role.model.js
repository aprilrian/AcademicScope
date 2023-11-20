const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Role = sequelize.define('Role', {
    nama: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Role;
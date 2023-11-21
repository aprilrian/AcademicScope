const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Role = sequelize.define('Role', {
    role: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Role;
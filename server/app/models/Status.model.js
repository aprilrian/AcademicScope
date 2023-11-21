const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Status = sequelize.define('Status', {
    status: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Status;
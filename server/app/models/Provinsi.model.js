const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Provinsi = sequelize.define('Provinsi', {
    kode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Provinsi;
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Provinsi = sequelize.define('Provinsi', {
    nama: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Provinsi;
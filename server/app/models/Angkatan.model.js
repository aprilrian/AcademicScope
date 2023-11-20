const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const Angkatan = sequelize.define('Angkatan', {
    nama: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = Angkatan;
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const JalurMasuk = sequelize.define('JalurMasuk', {
    nama: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

module.exports = JalurMasuk;
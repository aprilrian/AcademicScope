const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const Provinsi = require('./Provinsi.model');

const KabupatenKota = sequelize.define('KabupatenKota', {
    provinsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

KabupatenKota.belongsTo(Provinsi, { foreignKey: 'provinsi' })

module.exports = KabupatenKota;
const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const Provinsi = require('./Provinsi.model');

const KabupatenKota = sequelize.define('KabupatenKota', {
    kode: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    kode_provinsi: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    kabupaten_kota: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    });

KabupatenKota.belongsTo(Provinsi, { foreignKey: 'kode_provinsi' })

module.exports = KabupatenKota;
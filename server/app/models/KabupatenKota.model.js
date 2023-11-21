const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const Provinsi = require('./Provinsi.model');

const KabupatenKota = sequelize.define('KabupatenKota', {
    kabupaten_kota: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        unique: true,
    },
    provinsi: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    });

KabupatenKota.belongsTo(Provinsi, { foreignKey: 'provinsi' })

module.exports = KabupatenKota;
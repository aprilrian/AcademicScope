const { KabupatenKota } = require('../models')
const sequelize = require("sequelize");

exports.getAll = async (req, res) => {
    try {
        const data = await KabupatenKota.findAll({
            attributes: [[sequelize.literal("kode::text"), 'value'],
                        [sequelize.literal("kode_provinsi::text"), 'kode_provinsi'],
                        ['kabupaten_kota', 'label']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving kabupatenKota."
        });
    }
};

exports.getAllByProvinsi = async (req, res) => {
    try {
        const data = await KabupatenKota.findAll({
            attributes: [[sequelize.literal("kode::text"), 'value'],
                        [sequelize.literal("kode_provinsi::text"), 'kode_provinsi'],
                        ['kabupaten_kota', 'label']],
            where: {
                kode_provinsi: req.params.kode_provinsi
            }
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving kabupatenKota."
        });
    }
}

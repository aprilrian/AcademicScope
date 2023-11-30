const { KabupatenKota } = require('../models')

exports.getAll = async (req, res) => {
    try {
        const data = await KabupatenKota.findAll({
            attributes: [['kode', 'value'],
                        ['kode_provinsi', 'kode_provinsi'],
                        ['kabupaten_kota', 'label']]
        });
        res.status(200).send({
        message: "Success",
        data: data
        });
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving kabupatenKota."
        });
    }
};

exports.getAllByProvinsi = async (req, res) => {
    try {
        const data = await KabupatenKota.findAll({
            attributes: [['kode', 'value'],
                        ['kode_provinsi', 'kode_provinsi'],
                        ['kabupaten_kota', 'label']],
            where: {
                kode_provinsi: req.params.kode_provinsi
            }
        });
        res.status(200).send({
        message: "Success",
        data: data
        });
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving kabupatenKota."
        });
    }
}

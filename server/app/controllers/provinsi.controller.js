const { Provinsi } = require('../models') 

exports.getAll = async (req, res) => {
    try {
        const data = await Provinsi.findAll({
            attributes: ['kode', 'provinsi']
        });
        res.status(200).send({
        message: "Success",
        data: data
        });
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving provinsi."
        });
    }
}
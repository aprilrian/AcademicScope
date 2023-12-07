const { Provinsi } = require('../models') 
const sequelize = require("sequelize")

exports.getAll = async (req, res) => {
    try {
        const data = await Provinsi.findAll({
            attributes: [[sequelize.literal("kode::text"), 'value'],
                        ['provinsi', 'label']]
        });
        res.status(200).send(data);
    } catch (err) {
        res.status(500).send({
        message: err.message || "Some error occured while retrieving provinsi."
        });
    }
}
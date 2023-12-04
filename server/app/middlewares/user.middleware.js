const { Dosen, Mahasiswa, Departemen, Operator } = require("../models");

getDosenByID = async (req, res, next) => {
    try {
        const dosen = await Dosen.findOne({ where: { user_id: req.user_id } });
        if (!dosen) {
            return res.status(404).send({ message: "Dosen not found" });
        }
        req.dosen = dosen;
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

getMahasiswaByID = async (req, res, next) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({ where: { user_id: req.user_id } });
        if (!mahasiswa) {
            return res.status(404).send({ message: "Mahasiswa not found" });
        }
        req.mahasiswa = mahasiswa;
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

getMasterByID = async (req, res, next) => {
    try {
        const departemen = await Departemen.findOne({ where: { user_id: req.user_id } });
        const operator = await Operator.findOne({ where: { user_id: req.user_id } });
        if (!departemen && !operator) {
            return res.status(404).send({ message: "Master not found" });
        }
        if (departemen) {
            req.departemen = departemen;
        } else {
            req.operator = operator;
        }
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

hasUpdateProfile = async (req, res, next) => {
    try {
        if (req.dosen && req.dosen.alamat === null) {
            return res.send({ message: "Dosen belum melakukan update profil" });
        }

        if (req.mahasiswa && req.mahasiswa.email === null) {
            return res.send({ message: "Mahasiswa belum melakukan update profil" });
        }
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const userMiddleware = {
    getDosenByID,
    getMahasiswaByID,
    hasUpdateProfile,
}

module.exports = userMiddleware

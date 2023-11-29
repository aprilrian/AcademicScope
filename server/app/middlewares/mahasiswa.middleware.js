const { Mahasiswa } = require("../models");

getMahasiswaById = async (req, res, next) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where: {
                user_id: req.user_id,
            },
        });

        if (!mahasiswa) {
            return res.status(404).send({ message: "Mahasiswa not found" });
        }

        req.mahasiswa = mahasiswa;
        console.log(req.mahasiswa);
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

hasUpdateProfile = async (req, res, next) => {
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where: {
                user_id: req.user_id,
            },
        });

        if (!mahasiswa) {
            return res.status(404).send({ message: "Mahasiswa not found" });
        }

        if (mahasiswa.email === null) {
            return res.status(403).send({ message: "Mahasiswa has not update profile" });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const mahasiswaMiddleware = {
    getMahasiswaById,
    hasUpdateProfile,
}

module.exports = mahasiswaMiddleware

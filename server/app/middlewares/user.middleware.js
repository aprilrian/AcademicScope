const { Mahasiswa, User } = require("../models");

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

getDosenById = async (req, res, next) => {  
    try {
        const dosen = await Dosen.findOne({
            where: {
                user_id: req.user_id,
            },
        });

        if (!dosen) {
            return res.status(404).send({ message: "Dosen not found" });
        }

        req.dosen = dosen;
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

hasUpdateProfile = async (req, res, next) => {
    try {
        if (req.dosen && req.dosen.alamat === null) {
            return res.redirect("http://localhost:3000/doswal/updProfil");
        }

        if (req.mahasiswa && req.mahasiswa.email === null) {
            return res.redirect("http://localhost:3000/mhs/updProfil");
        }
        next();
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const mahasiswaMiddleware = {
    getMahasiswaById,
    getDosenById,
    hasUpdateProfile,
}

module.exports = mahasiswaMiddleware

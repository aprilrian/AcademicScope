// multer.js
const { parse } = require('dotenv');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = req.originalUrl;
        const urlSplit = url.split("/");
        const jenisFolder = urlSplit[urlSplit.length - 2];

        // cek jenis folder
        if (jenisFolder === "irs") {
            cb(null, "uploads/irs");
        } else if (jenisFolder === "khs") {
            cb(null, "uploads/khs");
        } else if (jenisFolder === "pkl") {
            cb(null, "uploads/pkl");
        } else if (jenisFolder === "skripsi") {
            cb(null, "uploads/skripsi");
        } else if (jenisFolder === "batch-generate") {
            cb(null, "uploads/accountMhs");
        } else if (jenisFolder === "batch-dosen") {
            cb(null, "uploads/accountDosen");
        } else if (urlSplit[urlSplit.length - 1] === 'editProfile' || urlSplit[urlSplit.length - 1] === 'updateProfile') {
            cb(null, "uploads/mahasiswa");
        } else {
            cb(null, "uploads");
        }
    },
    filename: (req, file, cb) => {
        const url = req.originalUrl;
        const urlSplit = url.split("/");
        const jenisFolder = urlSplit[urlSplit.length - 2];
        const ext = file.originalname.split(".").pop();
        const nama = req.user_nama;
        const username = req.user_username;
        if (jenisFolder === 'irs' || jenisFolder === 'khs') {
            const smt = parseInt(req.body.semester_aktif);
            const filename = `${nama}_${username}_${smt}.${ext}`;
            cb(null, filename);
        } else {
            const filename = `${nama}_${username}.${ext}`;
            cb(null, filename);
        }

    },
});

const filter = (req, file, cb) => {
    if (
        file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg" ||
        file.mimetype === "application/pdf" ||
        file.mimetype === "text/csv" ||
        file.mimetype === "application/vnd.ms-excel" ||
        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({ storage: storage, fileFilter: filter }).single("file");

module.exports = upload
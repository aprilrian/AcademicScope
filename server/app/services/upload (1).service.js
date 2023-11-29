// multer.js
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const url = req.url;
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
        } else if (urlSplit[urlSplit.length - 1] === 'updateProfil') {
            cb(null, "uploads/foto");
        } else {
            cb(null, "uploads");
        }
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split(".").pop();
        const nama = req.user_nama;
        const filename = `${nama}-${new Date().getTime()}.${ext}`;

        cb(null, filename);
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
const { Sequelize } = require('sequelize');
const sequelize = require('../configs/db.config');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.mahasiswa = require("./Mahasiswa.model");
db.dosen = require("./Dosen.model");
db.user = require("./User.model");
db.KabupatenKota = require("./KabupatenKota.model");    
db.provinsi = require("./Provinsi.model");
db.role = require("./Role.model");
db.status = require("./Status.model");
db.angkatan = require("./Angkatan.model");
db.jalurMasuk = require("./JalurMasuk.model");
db.irs = require("./irs.model");
db.khs = require("./khs.model");
db.pkl = require("./pkl.model");
db.skripsi = require("./skripsi.model");

async function initializeData() {
    const Angkatan = db.angkatan
    const JalurMasuk = db.jalurMasuk;
    const Role = db.role;
    const Status = db.status;
    const User = db.user;

    try {
        const angkatanCount = await Angkatan.count();
        const jalurMasukCount = await JalurMasuk.count();
        const roleCount = await Role.count();
        const statusCount = await Status.count();
        const userCount = await User.count();

        if (angkatanCount === 0) {
        await Angkatan.bulkCreate([
            { angkatan: '2016' },
            { angkatan: '2017' },
            { angkatan: '2018' },
            { angkatan: '2019' },
            { angkatan: '2020' },
            { angkatan: '2021' },
            { angkatan: '2022' },
            { angkatan: '2023' },
        ]);

        console.log('Added initial data to angkatan collection');
        }

        if (jalurMasukCount === 0) {
        await JalurMasuk.bulkCreate([
            { jalur_masuk: 'snmptn' },
            { jalur_masuk: 'sbmptn' },
            { jalur_masuk: 'mandiri' },
            { jalur_masuk: 'lainnya' },
        ]);

        console.log('Added initial data to jalurMasuk collection');
        }

        if (roleCount === 0) {
        await Role.bulkCreate([
            { role: 'operator' },
            { role: 'mahasiswa' },
            { role: 'dosen' },
            { role: 'departemen' },
        ]);

        console.log('Added initial data to roles collection');
        }

        if (statusCount === 0) {
        await Status.bulkCreate([
            { status: 'aktif' },
            { status: 'cuti' },
            { status: 'mangkir' },
            { status: 'do' },
            { status: 'undur diri' },
            { status: 'lulus' },
            { status: 'meninggal dunia' },
        ]);

        console.log('Added initial data to status collection');
        }

        if (userCount === 0) {
        await User.bulkCreate([
            {
            username: 'operator',
            email: 'operator@operator.undip.ac.id',
            password: '$2b$10$yqdURhG0X7npTyfBKvnQoeoKDb3WQUCKpFa5G/5mshYSnO2pEFciy',
            role: 'operator',
            },
            {
            username: 'departemen',
            email: 'departemen@departemen.undip.ac.id',
            password: '$2b$10$q.1KQHs.lAUndhCxwJF4/eHQuJgvb3FYZfw8oQo1rj7jBaCsSmVEK',
            role: 'departemen',
            },
        ]);
        }
        
    } catch (error) {
        console.error('Error initializing data:', error);
    }
}

module.exports = {
    db,
    Mahasiswa: db.mahasiswa,
    Dosen: db.dosen,
    User: db.user,
    KabupatenKota: db.KabupatenKota,
    Provinsi: db.provinsi,
    Role: db.role,
    Status: db.status,
    Angkatan: db.angkatan,
    JalurMasuk: db.jalurMasuk,
    initializeData,
}
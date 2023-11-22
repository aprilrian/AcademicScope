const { Sequelize } = require('sequelize');
const sequelize = require('../configs/db.config');
const path = require('path');
const csv = require('csvtojson')

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
    const Provinsi = db.provinsi;
    const KabupatenKota = db.KabupatenKota;
    const Dosen = db.dosen;

    try {
        const angkatanCount = await Angkatan.count();
        const jalurMasukCount = await JalurMasuk.count();
        const provinsiCount = await Provinsi.count();
        const kabupatenKotaCount = await KabupatenKota.count();
        const roleCount = await Role.count();
        const statusCount = await Status.count();
        const userCount = await User.count();
        const dosenCount = await Dosen.count();

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

        if (provinsiCount === 0) {
            await Provinsi.bulkCreate([
                { id: 11, provinsi: 'ACEH' },
                { id: 12, provinsi: 'SUMATERA UTARA' },
                { id: 13, provinsi: 'SUMATERA BARAT' },
                { id: 14, provinsi: 'RIAU' },
                { id: 15, provinsi: 'JAMBI' },
                { id: 16, provinsi: 'SUMATERA SELATAN' },
                { id: 17, provinsi: 'BENGKULU' },
                { id: 18, provinsi: 'LAMPUNG' },
                { id: 19, provinsi: 'KEPULAUAN BANGKA BELITUNG' },
                { id: 21, provinsi: 'KEPULAUAN RIAU' },
                { id: 31, provinsi: 'DKI JAKARTA' },
                { id: 32, provinsi: 'JAWA BARAT' },
                { id: 33, provinsi: 'JAWA TENGAH' },
                { id: 34, provinsi: 'DAERAH ISTIMEWA YOGYAKARTA' },
                { id: 35, provinsi: 'JAWA TIMUR' },
                { id: 36, provinsi: 'BANTEN' },
                { id: 51, provinsi: 'BALI' },
                { id: 52, provinsi: 'NUSA TENGGARA BARAT' },
                { id: 53, provinsi: 'NUSA TENGGARA TIMUR' },
                { id: 61, provinsi: 'KALIMANTAN BARAT' },
                { id: 62, provinsi: 'KALIMANTAN TENGAH' },
                { id: 63, provinsi: 'KALIMANTAN SELATAN' },
                { id: 64, provinsi: 'KALIMANTAN TIMUR' },
                { id: 65, provinsi: 'KALIMANTAN UTARA' },
                { id: 71, provinsi: 'SULAWESI UTARA' },
                { id: 72, provinsi: 'SULAWESI TENGAH' },
                { id: 73, provinsi: 'SULAWESI SELATAN' },
                { id: 74, provinsi: 'SULAWESI TENGGARA' },
                { id: 75, provinsi: 'GORONTALO' },
                { id: 76, provinsi: 'SULAWESI BARAT' },
                { id: 81, provinsi: 'MALUKU' },
                { id: 82, provinsi: 'MALUKU UTARA' },
                { id: 91, provinsi: 'PAPUA' },
                { id: 92, provinsi: 'PAPUA BARAT' },
                { id: 93, provinsi: 'PAPUA SELATAN' },
                { id: 94, provinsi: 'PAPUA TENGAH' },
                { id: 95, provinsi: 'PAPUA PEGUNUNGAN' },
              ]);
        }

        if (kabupatenKotaCount === 0) {
            const filePath = path.join(__dirname, '/uploads/regencies.csv');

            try {
                const jsonArray = await csv().fromFile(filePath);
            
                await KabupatenKota.sequelize.transaction(async (t) => {
                  for (const row of jsonArray) {
                    await KabupatenKota.create(
                      {
                        id: row.id,
                        id_provinsi: row.id_provinsi,
                        kabupaten_kota: row.kabupaten_kota,
                      },
                      { transaction: t }
                    );
                  }
                });
            
                console.log(`Data successfully added to KabupatenKota collection`);
              } catch (err) {
                console.error(`Error adding data to KabupatenKota collection:`, err);
              }
        }

        if (dosenCount === 0) {
          const filePath = './uploads/dosen.csv'
        
          try {
            const jsonArray = await csv().fromFile(filePath, { delimiter: ';' });
            
            console.log(jsonArray)

            await User.sequelize.transaction(async (t) => {
              for (const row of jsonArray) {
                
                const [nip, nama] = row['nip;nama'].split(';');
                const fullNama = [nama, row.field2, row.field3].filter(Boolean).join(', ');
                const user = await User.create(
                  {
                    username: nip,
                    password: nip,
                    role: "dosen",
                  },
                  { transaction: t }
                );
        
                await Dosen.create(
                  {
                    nip: nip,
                    nama: fullNama,
                    user_id: user.id, 
                  },
                  { transaction: t }
                );
              }
            });
        
            console.log(`Data successfully added to Dosen collection`);
          } catch (err) {
            console.error(`Error adding data to Dosen collection:`, err);
          }
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
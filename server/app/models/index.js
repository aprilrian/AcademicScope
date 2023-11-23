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
db.irs = require("./IRS.model");
db.khs = require("./KHS.model");
db.pkl = require("./PKL.model");
db.skripsi = require("./Skripsi.model");

async function initializeData() {
    const User = db.user;
    const Provinsi = db.provinsi;
    const KabupatenKota = db.KabupatenKota;
    const Dosen = db.dosen;

    try {
        const provinsiCount = await Provinsi.count();
        const kabupatenKotaCount = await KabupatenKota.count();
        const userCount = await User.count();
        const dosenCount = await Dosen.count();

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
                { kode: 11, provinsi: 'ACEH' },
                { kode: 12, provinsi: 'SUMATERA UTARA' },
                { kode: 13, provinsi: 'SUMATERA BARAT' },
                { kode: 14, provinsi: 'RIAU' },
                { kode: 15, provinsi: 'JAMBI' },
                { kode: 16, provinsi: 'SUMATERA SELATAN' },
                { kode: 17, provinsi: 'BENGKULU' },
                { kode: 18, provinsi: 'LAMPUNG' },
                { kode: 19, provinsi: 'KEPULAUAN BANGKA BELITUNG' },
                { kode: 21, provinsi: 'KEPULAUAN RIAU' },
                { kode: 31, provinsi: 'DKI JAKARTA' },
                { kode: 32, provinsi: 'JAWA BARAT' },
                { kode: 33, provinsi: 'JAWA TENGAH' },
                { kode: 34, provinsi: 'DAERAH ISTIMEWA YOGYAKARTA' },
                { kode: 35, provinsi: 'JAWA TIMUR' },
                { kode: 36, provinsi: 'BANTEN' },
                { kode: 51, provinsi: 'BALI' },
                { kode: 52, provinsi: 'NUSA TENGGARA BARAT' },
                { kode: 53, provinsi: 'NUSA TENGGARA TIMUR' },
                { kode: 61, provinsi: 'KALIMANTAN BARAT' },
                { kode: 62, provinsi: 'KALIMANTAN TENGAH' },
                { kode: 63, provinsi: 'KALIMANTAN SELATAN' },
                { kode: 64, provinsi: 'KALIMANTAN TIMUR' },
                { kode: 65, provinsi: 'KALIMANTAN UTARA' },
                { kode: 71, provinsi: 'SULAWESI UTARA' },
                { kode: 72, provinsi: 'SULAWESI TENGAH' },
                { kode: 73, provinsi: 'SULAWESI SELATAN' },
                { kode: 74, provinsi: 'SULAWESI TENGGARA' },
                { kode: 75, provinsi: 'GORONTALO' },
                { kode: 76, provinsi: 'SULAWESI BARAT' },
                { kode: 81, provinsi: 'MALUKU' },
                { kode: 82, provinsi: 'MALUKU UTARA' },
                { kode: 91, provinsi: 'PAPUA' },
                { kode: 92, provinsi: 'PAPUA BARAT' },
                { kode: 93, provinsi: 'PAPUA SELATAN' },
                { kode: 94, provinsi: 'PAPUA TENGAH' },
                { kode: 95, provinsi: 'PAPUA PEGUNUNGAN' },
              ]);
        }

        if (kabupatenKotaCount === 0) {
            const filePath = './uploads/regencies.csv';

            try {
                const jsonArray = await csv().fromFile(filePath);
            
                await KabupatenKota.sequelize.transaction(async (t) => {
                  for (const row of jsonArray) {
                    await KabupatenKota.create(
                      {
                        kode: row.kode,
                        kode_provinsi: row.kode_provinsi,
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
    IRS: db.irs,
    KHS: db.khs,
    PKL: db.pkl,
    Skripsi: db.skripsi,
    initializeData,
}
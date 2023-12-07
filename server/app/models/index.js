const { Sequelize } = require('sequelize');
const sequelize = require('../configs/db.config');
const csv = require('csvtojson')

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./User.model");
db.dosen = require("./Dosen.model");
db.kabupatenKota = require("./KabupatenKota.model");    
db.provinsi = require("./Provinsi.model");
db.mahasiswa = require("./Mahasiswa.model");
db.irs = require("./IRS.model");
db.khs = require("./KHS.model");
db.pkl = require("./PKL.model");
db.skripsi = require("./Skripsi.model");
db.operator = require("./Operator.model");
db.departemen = require("./Departemen.model");

const User = db.user;
const Dosen = db.dosen;
const KabupatenKota = db.kabupatenKota;
const Provinsi = db.provinsi;
const Mahasiswa = db.mahasiswa;
const IRS = db.irs;
const KHS = db.khs;
const PKL = db.pkl;
const Skripsi = db.skripsi;
const Operator = db.operator;
const Departemen = db.departemen;

User.hasOne(require('./Mahasiswa.model'), { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(require('./Operator.model'), { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(require('./Dosen.model'), { foreignKey: 'user_id', onDelete: 'CASCADE' });
User.hasOne(require('./Departemen.model'), { foreignKey: 'user_id', onDelete: 'CASCADE' });

Dosen.belongsTo(User, { foreignKey: 'user_id' });
Dosen.hasMany(Mahasiswa, { foreignKey: 'nip_dosen' });

KabupatenKota.belongsTo(Provinsi, { foreignKey: 'kode_provinsi' })

Mahasiswa.belongsTo(KabupatenKota, { foreignKey: 'kode_kabupatenKota' })
Mahasiswa.belongsTo(Provinsi, { foreignKey: 'kode_provinsi' })
Mahasiswa.belongsTo(Dosen, { foreignKey: 'nip_dosen' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });
Mahasiswa.hasMany(IRS, { foreignKey: 'mahasiswa_nim' });
Mahasiswa.hasMany(KHS, { foreignKey: 'mahasiswa_nim' });
Mahasiswa.hasOne(PKL, { foreignKey: 'mahasiswa_nim' });
Mahasiswa.hasOne(Skripsi, { foreignKey: 'mahasiswa_nim' });

IRS.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_nim' });
KHS.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_nim' });
Skripsi.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_nim' });
PKL.belongsTo(Mahasiswa, { foreignKey: 'mahasiswa_nim' });

Operator.belongsTo(User, { foreignKey: 'user_id' });

Departemen.belongsTo(User, { foreignKey: 'user_id' });

async function initializeData() {
  try {
      const provinsiCount = await Provinsi.count();
      const kabupatenKotaCount = await KabupatenKota.count();
      const mahasiswaCount = await Mahasiswa.count();
      const dosenCount = await Dosen.count();
      const operatorCount = await Operator.count();
      const departemenCount = await Departemen.count();

      if (operatorCount === 0) {
        try {
          await User.sequelize.transaction(async (t) => {
            const operatorData = [
              { nip: 'H.7.198611152023101001', nama: 'Beny Nugroho, S.Kom.', email: 'benynugrohofsm@staff.undip.ac.id', foto: 'uploads\\operator\\beny.png'},
              { nip: 'H.7.198911012023102001', nama: 'Annisa Istiadah N., A.Md.', email: 'annisaistiadah@staff.undip.ac.id', foto: 'uploads\\operator\\annisa.png'},
              { nip: 'H.7.199406052023101001', nama: 'Anang Ardiyanto, S.Kom.', email: 'anangardi@staff.undip.ac.id', foto: 'uploads\\operator\\anang.png'},
              { nip: '', nama: 'Muhamat Jamal', email: '', foto: 'uploads\\operator\\jamal.png'},
            ]

            for (const row of operatorData) {
              const { nip, nama, email, foto } = row;
              const user = await User.create(
                {
                  username: nip != '' ? nip : '-',
                  password: nip != '' ? nip : '-',
                  role: "operator",
                },
                { transaction: t }
              );
      
              await Operator.create(
                {
                  nip: nip,
                  nama: nama,
                  email: email,
                  foto: foto,
                  user_id: user.id, 
                },
                { transaction: t }
                );
              }
          });
          console.log(`Data successfully added to Operator collection`);
        } catch (err) {
          console.error(`Error adding data to Operator collection:`, err);
        }
      }

      if (departemenCount === 0) {
        try {
          await Departemen.sequelize.transaction(async (t) => {
            const departemenData = { nama: 'Departemen Informatika Undip', email: 'if@live.undip.ac.id', alamat: 'Jl. Prof. Jacub Rais Kampus Tembalang Semarang', phone: '(024) 70594104', foto: 'uploads\\departemen\\departemen.jpgg' };

            const user = await User.create(
              {
                username: 'departemen',
                password: 'departemen',
                role: "departemen",
              },
              { transaction: t }
            );

            await Departemen.create(
              {
                nama: departemenData.nama,
                email: departemenData.email,
                alamat: departemenData.alamat,
                phone: departemenData.phone,
                foto: departemenData.foto,
                user_id: user.id,
              },
              { transaction: t }
            );
          });
          console.log(`Data successfully added to Departemen collection`);
        } catch (err) {
          console.error(`Error adding data to Departemen collection:`, err);
        }
      }

      if (dosenCount === 0) {
        try {
          await User.sequelize.transaction(async (t) => {
            const dosenData = [
              { nip: '196902141994032002', nama: 'Prof. Dr. Widowati, S.Si., M.Si.', email: 'widowati@lecturer.undip.ac.id', foto: 'uploads\\dosen\\widowati.png' },
              { nip: '195809011986032002', nama: 'Prof. Dr. Dra. Sunarsih, M.Si.', email: 'sunarsih@lecturer.undip.ac.id', foto: 'uploads\\dosen\\sunarsih.png' },
              { nip: '196511231994031003', nama: 'Prof. Dr. Rahmat Gernowo, M.Si.', email: 'rahmatgernowo@lecturer.undip.ac.id', foto: 'uploads\\dosen\\gernowo.png' },
              { nip: '197203171998021001', nama: 'Prof. Dr. Kusworo Adi, S.Si., M.T.', email: 'kusworoadi@lecturer.undip.ac.id', foto: 'uploads\\dosen\\kusworo.png' },
              { nip: '196311051988031001', nama: 'Drs. Bayu Surarso, M.Sc., Ph.D.', email: 'bayus@lecturer.undip.ac.id', foto: 'uploads\\dosen\\bayusurarso.png' },
              { nip: '197312202000121001', nama: 'Farikhin, S.Si., M.Si., Ph.D.', email: 'farikhin@lecturer.undip.ac.id', foto: 'uploads\\dosen\\farikhin.png' },
              { nip: '196109281986032002', nama: 'Dr. Dra. Tatik Widiharih, M.Si.', email: 'tatikwidiharih@lecturer.undip.ac.id', foto: 'uploads\\dosen\\tatik.png' },
              { nip: '196307061991021001', nama: 'Dr. Drs. Tarno, M.Si.', email: 'tarno@lecturer.undip.ac.id', foto: 'uploads\\dosen\\tarno.png' },
              { nip: '198203092006041002', nama: 'Dr.Eng. Adi Wibowo, S.Si., M.Kom.', email: 'adiwibowo@lecturer.undip.ac.id', foto: 'uploads\\dosen\\adiwibowo.png' },
              { nip: '197601102009122002', nama: 'Dinar Mutiara Kusumo Nugraheni, S.T., M.InfoTech.(Comp)., Ph.D.', email: 'dinarmutiara@lecturer.undip.ac.id', foto: 'uploads\\dosen\\dinarmutiara.png' },
              { nip: '197404011999031002', nama: 'Dr. Aris Puji Widodo, S.Si., M.T.', email: 'arispw@lecturer.undip.ac.id', foto: 'uploads\\dosen\\arispujiwidodo.png' },
              { nip: '197108111997021004', nama: 'Dr. Aris Sugiharto, S.Si., M.Kom.', email: 'arissugiharto@lecturer.undip.ac.id', foto: 'uploads\\dosen\\ariss.png' },
              { nip: '197508241999031003', nama: 'Dr. Budi Warsito, S.Si., M.Si.', email: 'budiwarsito@lecturer.undip.ac.id', foto: 'uploads\\dosen\\budiwarsito.png' },
              { nip: '198104202005012001', nama: 'Dr. Retno Kusumaningrum, S.Si., M.Kom.', email: 'retno@lecturer.undip.ac.id', foto: 'uploads\\dosen\\retnokusumaningrum.png' },
              { nip: '196405181992031002', nama: 'Dr.Drs. Catur Edi Widodo, M.T.', email: 'caturediwidodo@lecturer.undip.ac.id', foto: 'uploads\\dosen\\catur.png' },
              { nip: '196502251992011001', nama: 'Dr.Drs. Rukun Santoso, M.Si.', email: 'rukunsantoso@lecturer.undip.ac.id', foto: 'uploads\\dosen\\rukun.png' },
              { nip: '197211211998021001', nama: 'Jatmiko Endro Suseno, S.Si., M.Si., Ph.D.', email: 'jatmikoendro@lecturer.undip.ac.id', foto: 'uploads\\dosen\\jatmiko.png' },
              { nip: '197905242009121003', nama: 'Dr. Sutikno, S.T., M.Cs.', email: 'sutikno@lecturer.undip.ac.id', foto: 'uploads\\dosen\\sutik.png' },
              { nip: '196511071992031003', nama: 'Drs. Eko Adi Sarwoko, M.Komp.', email: 'ekoadisarwoko@lecturer.undip.ac.id', foto: 'uploads\\dosen\\ekoadisarwoko.png' },
              { nip: '197007051997021001', nama: 'Priyo Sidik Sasongko, S.Si., M.Kom.', email: 'priyosidiksasongko@lecturer.undip.ac.id', foto: 'uploads\\dosen\\priyosidik.png' },
              { nip: '197308291998022001', nama: 'Beta Noranita, S.Si., M.Kom.', email: 'betanoranita@lecturer.undip.ac.id', foto: 'uploads\\dosen\\betanoranita1.png' },
              { nip: '198009142006041002', nama: 'Edy Suharto, S.T., M.Kom', email: 'edys@lecturer.undip.ac.id', foto: 'uploads\\dosen\\edysuharto.png' },
              { nip: '198404112019031009', nama: 'Fajar Agung Nugroho, S.Kom., M.Cs.', email: 'fajar@lecturer.undip.ac.id', foto: 'uploads\\dosen\\fajaragung.png' },
              { nip: '198012272015041002', nama: 'Guruh Aryotejo, S.Kom., M.Sc.', email: 'guruh@lecturer.undip.ac.id', foto: 'uploads\\dosen\\guruh.png' },
              { nip: '197805162003121001', nama: 'Helmie Arif Wibawa, S.Si., M.Cs.', email: 'helmie@lecturer.undip.ac.id', foto: 'uploads\\dosen\\helmiearif.png' },
              { nip: '197902122008121002', nama: 'Dr. Indra Waspada, S.T., M.TI', email: 'indrawaspada@lecturer.undip.ac.id', foto: 'uploads\\dosen\\indrawas1.png' },
              { nip: '198903032015042002', nama: 'Khadijah, S.Kom., M.Cs.', email: 'khadijah@lecturer.undip.ac.id', foto: 'uploads\\dosen\\khadijah.png' },
              { nip: '198106202015041002', nama: 'Muhammad Malik Hakim, S.T., M.T.I.', email: 'muhammadmalikhakim@lecturer.undip.ac.id', foto: 'uploads\\dosen\\muhammadmalik.png' },
              { nip: '197907202003121002', nama: 'Nurdin Bahtiar, S.Si., M.T.', email: 'nurdinbahtiar@lecturer.undip.ac.id', foto: 'uploads\\dosen\\nurdinbahtiar.png' },
              { nip: '198803222020121010', nama: 'Prajanto Wahyu Adi, M.Kom.', email: 'prajanto@lecturer.undip.ac.id', foto: 'uploads\\dosen\\prajanto.png' },
              { nip: '198010212005011003', nama: 'Ragil Saputra, S.Si., M.Cs.', email: 'ragilsaputra@lecturer.undip.ac.id', foto: 'uploads\\dosen\\ragilsaputra1.png' },
              { nip: '198511252018032001', nama: 'Rismiyati, B.Eng, M.Cs', email: 'rismiyati@lecturer.undip.ac.id', foto: 'uploads\\dosen\\rismiyati.png' },
              { nip: '198302032006041002', nama: 'Satriyo Adhy, S.Si., M.T.', email: 'satriyo@lecturer.undip.ac.id', foto: 'uploads\\dosen\\satriyo.png' },
              { nip: '198506302012121001', nama: 'Solikhin, S.Si., M.Sc.', email: 'solikhin@lecturer.undip.ac.id', foto: 'uploads\\dosen\\solikhin.png' },
              { nip: '197805022005012002', nama: 'Sukmawati Nur Endah, S.Si., M.Kom.', email: 'sukmane@lecturer.undip.ac.id', foto: 'uploads\\dosen\\sukmawati.png' },
              { nip: 'H.7.199112092022041001', nama: 'Adhe Setya Pramayoga, S.Kom., M.T.', email: 'adhesetya@lecturer.undip.ac.id', foto: 'uploads\\dosen\\adhesetya.png' },
              { nip: 'H.7.199603032022041001', nama: 'Sandy Kurniawan, S.Kom., M.Kom.', email: 'sandy@lecturer.undip.ac.id', foto: 'uploads\\dosen\\sandy.png' },
              { nip: 'H.7.198806142022102001', nama: 'Yunila Dwi Putri Ariyanti, S.Kom., M.Kom.', email: 'yuniladwiputriariyan@lecturer.undip.ac.id', foto: 'uploads\\dosen\\yuniladwi.png' },
              { nip: 'H.7.199204252023072001', nama: 'Dr. Yeva Fadhilah Ashari, S.Si., M.Si.', email: 'yeva@lecturer.undip.ac.id', foto: 'uploads\\dosen\\yeva.png' },
              { nip: 'H.7.199602212023072001', nama: 'Etna Vianita, S.Mat., M.Mat.', email: 'etnavianita02@lecturer.undip.ac.id', foto: 'uploads\\dosen\\etna.png' },                
            ]

            for (const row of dosenData) {
              const { nip, nama, email, foto } = row;
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
                  nama: nama,
                  email: email,
                  foto: foto,
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

      if (mahasiswaCount === 0) {
        try {
          await User.sequelize.transaction(async (t) => {
            const mahasiswaData = [
            { nim: '24060121140120', nama: "Christian Joshua Nathanael Nadeak", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: "24060121140100", nama: "Zhafira Amanda", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140101', nama: "Achmad Fauzan", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140102', nama: "Aditya Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140103', nama: "Aditya Putra Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140104', nama: "Aditya Putra Wijaya", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140105', nama: "Aditya Rizky Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140106', nama: "Aditya Surya Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140107', nama: "Aditya Yudha Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140108', nama: "Aditya Yudha Pratama Putra", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140109', nama: "Aditya Yudha Putra Pratama", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            { nim: '24060121140110', nama: "Aditya Yudha Putra Pratama Putra", angkatan: "2021", status: "aktif", nip_dosen: "196511071992031003" },
            ]


            const user = await User.create(
              {
                username: mahasiswaData.nim,
                password: mahasiswaData.nim,
                role: "mahasiswa",
              },
              { transaction: t }
            );

            await Mahasiswa.create(
              {
                nim: mahasiswaData.nim,
                nama: mahasiswaData.nama,
                angkatan: mahasiswaData.angkatan,
                status: mahasiswaData.status,
                nip_dosen: mahasiswaData.nip_dosen,
                user_id: user.id,
              },
              { transaction: t }
            );
          });
          console.log(`Data successfully added to Mahasiswa collection`);
        } catch (err) {
          console.error(`Error adding data to Mahasiswa collection:`, err);
        }
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

  } catch (err) {
      console.error(`Error initializing data:`, err);
  }
}
        
module.exports = {
    db,
    Mahasiswa,
    Dosen,
    Operator,
    Departemen,
    User,
    KabupatenKota,
    Provinsi,
    IRS,
    KHS,
    PKL,
    Skripsi,
    initializeData,
}
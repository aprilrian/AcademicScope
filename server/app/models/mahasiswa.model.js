const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const User = require('./User.model');
const Dosen = require('./Dosen.model');
const KabupatenKota = require('./KabupatenKota.model');
const Provinsi = require('./Provinsi.model');
const IRS = require('./IRS.model');
const KHS = require('./KHS.model');
const Skripsi = require('./Skripsi.model');
const PKL = require('./PKL.model');

const Mahasiswa = sequelize.define('Mahasiswa', {
  nim: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: {
      args: false,
      msg: 'NIM wajib diisi',
    },
    unique: {
      args: true,
      msg: 'NIM sudah terdaftar',
    },
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Nama wajib diisi',
    },
  },
  alamat: {
    type: DataTypes.STRING,
  },
  kode_kabupatenKota: {
    type: DataTypes.INTEGER,
  },
  kode_provinsi: {
    type: DataTypes.INTEGER,
  },
  angkatan: {
    type: DataTypes.ENUM('2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'),
    allowNull: {
      args: false,
      msg: 'Angkatan wajib diisi',
    },
  },
  jalur_masuk: {
    type: DataTypes.ENUM('SNMPTN', 'SBMPTN', 'Mandiri', 'Lainnya'),
  },
  email: {
    type: DataTypes.STRING,
    unique: {
      args: true,
      msg: 'Email sudah terdaftar',
    },
  },
  phone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('aktif', 'cuti', 'mangkir', 'do', 'undur diri', 'lulus', 'meninggal dunia'),
    allowNull: {
      args: false,
      msg: 'Status wajib diisi',
    },
  },
  foto: {
    type: DataTypes.STRING,
  },
  nip_dosen: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'NIP Dosen wajib diisi',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Mahasiswa.belongsTo(KabupatenKota, { foreignKey: 'kode_kabupatenKota' })
Mahasiswa.belongsTo(Provinsi, { foreignKey: 'kode_provinsi' })
Mahasiswa.belongsTo(User, { foreignKey: 'email', targetKey: 'email' })
Mahasiswa.belongsTo(Dosen, { foreignKey: 'nip_dosen' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });
Mahasiswa.hasMany(IRS)
Mahasiswa.hasMany(KHS)
Mahasiswa.hasOne(PKL)
Mahasiswa.hasOne(Skripsi)

module.exports = Mahasiswa;
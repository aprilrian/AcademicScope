const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

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
    type: DataTypes.ENUM('snmptn', 'sbmptn', 'mandiri', 'lainnya'),
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
    type: DataTypes.ENUM('aktif', 'cuti', 'mangkir', 'do', 'undur_diri', 'lulus', 'meninggal_dunia'),
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

module.exports = Mahasiswa;
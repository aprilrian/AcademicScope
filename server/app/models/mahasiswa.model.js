const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');
const User = require('./User.model');
const Dosen = require('./Dosen.model');
const Status = require('./Status.model');
const KabupatenKota = require('./KabupatenKota.model');
const Provinsi = require('./Provinsi.model');
const Angkatan = require('./Angkatan.model');
const JalurMasuk = require('./JalurMasuk.model');

const Mahasiswa = sequelize.define('Mahasiswa', {
  nim: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
    unique: true,
  },
  nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  alamat: {
    type: DataTypes.STRING,
  },
  kabupatenKota: {
    type: DataTypes.STRING,
  },
  provinsi: {
    type: DataTypes.STRING,
  },
  angkatan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jalur_masuk: {
    type: DataTypes.STRING,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
  },
  phone: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  foto: {
    type: DataTypes.STRING,
  },
  nip_dosen: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
  },
});

Mahasiswa.belongsTo(KabupatenKota, { foreignKey: 'kabupatenKota' })
Mahasiswa.belongsTo(Provinsi, { foreignKey: 'provinsi' })
Mahasiswa.belongsTo(Angkatan, { foreignKey: 'angkatan' })
Mahasiswa.belongsTo(JalurMasuk, { foreignKey: 'jalur_masuk' })
Mahasiswa.belongsTo(Status, { foreignKey: 'status' })
Mahasiswa.belongsTo(Dosen, { foreignKey: 'nip_dosen' });
Mahasiswa.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Mahasiswa;
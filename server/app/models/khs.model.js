const { DataTypes } = require('sequelize');
const sequelize = require('../configs/db.config');

const KHS = sequelize.define('KHS', {
  mahasiswa_nim: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  semester_aktif: {
    type: DataTypes.INTEGER,
    allowNull: {
      args: false,
      msg: 'Semester aktif wajib diisi',
    },
    validate: {
      isInt: {
        msg: 'Semester aktif harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Semester aktif dalam rentang 1-14',
      },
      max: {
        args: [14],
        msg: 'Semester aktif dalam rentang 1-14',
      },
    },
  },

  sks: {
    type: DataTypes.INTEGER,
    allowNull: {
      args: false,
      msg: 'Jumlah SKS wajib diisi',
    },
    validate: {
      isInt: {
        msg: 'Jumlah SKS harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Jumlah SKS minimal 1 SKS',
      },
      max: {
        args: [24],
        msg: 'Jumlah SKS maksimal 24 SKS',
      },
    },
  },

  sks_kumulatif: {
    type: DataTypes.INTEGER,
    allowNull: {
      args: false,
      msg: 'Jumlah SKS kumulatif wajib diisi',
    },
    validate: {
      isInt: {
        msg: 'Jumlah SKS kumulatif harus berupa angka',
      },
      min: {
        args: [1],
        msg: 'Jumlah SKS kumulatif minimal 1 SKS',
      },
    },
  },

  ip: {
    type: DataTypes.FLOAT,
    allowNull: {
      args: false,
      msg: 'IP wajib diisi',
    },
    validate: {
      isFloat: {
        msg: 'IP harus berupa angka',
      },
      min: {
        args: [0],
        msg: 'IP dalam rentang 0-4',
      },
      max: { 
        args: [4], msg: 'IP dalam rentang 0-4' 
      },
    },
  },

  ip_kumulatif: {
    type: DataTypes.FLOAT,
    allowNull: {
      args: false,
      msg: 'IP kumulatif wajib diisi',
    },
    validate: {
      isFloat: {
        msg: 'IP kumulatif harus berupa angka',
      },
      min: {
        args: [0],
        msg: 'IP kumulatif dalam rentang 0-4',
      },
      max: { 
        args: [4], msg: 'IP kumulatif dalam rentang 0-4' 
      },
    },
  },

  status_verifikasi: {
    type: DataTypes.ENUM('belum', 'sedang diverifikasi' ,'sudah'),
    defaultValue: 'belum',
  },

  file: {
    type: DataTypes.STRING,
    allowNull: {
      args: false,
      msg: 'Wajib upload scan KHS',
    },
  },

}, {
  tableName: 'KHSs'
});

module.exports = KHS;

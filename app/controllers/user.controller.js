const { User, Mahasiswa, Dosen, KabupatenKota, Provinsi, Operator, Departemen, IRS, KHS, PKL, Skripsi } = require("../models");
const csv = require('csvtojson');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const sequelize = require("sequelize");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
}

exports.operatorBoard = (req, res) => {
  res.status(200).send("Operator Content.");
}

exports.mahasiswaBoard = (req, res) => {
  res.status(200).send("Mahasiswa Content.");
}

exports.dosenBoard = (req, res) => {
  res.status(200).send("Dosen Content.");
}

exports.departemenBoard = (req, res) => {
  res.status(200).send("Departemen Content.");
}

exports.changePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const passwordHash = bcrypt.hashSync(password, 8);
    await User.update({ password: passwordHash }, { where: { id: req.user_id } });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.viewProfile = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.params.id ? req.params.id : req.user_id } });

    if (user.role === 'mahasiswa') {
      const mahasiswa = await Mahasiswa.findOne({ where: { user_id: req.user_id } });

      if (!mahasiswa) {
        return res.status(404).send({ message: "Mahasiswa data not found!" });
      }

      const dosen = await Dosen.findOne({ where: { nip: mahasiswa.nip_dosen } });
      const kabupatenKota = await KabupatenKota.findByPk(mahasiswa.kode_kabupatenKota);
      const provinsi = await Provinsi.findByPk(mahasiswa.kode_provinsi);

      res.status(200).send({
        role: user.role,
        nim: mahasiswa.nim,
        nama: mahasiswa.nama,
        angkatan: mahasiswa.angkatan,
        alamat: mahasiswa.alamat,
        kabupatenKota: kabupatenKota ? kabupatenKota.kabupaten_kota : null,
        provinsi: provinsi ? provinsi.provinsi : null,
        jalur_masuk: mahasiswa.jalur_masuk,
        email: mahasiswa.email,
        phone: mahasiswa.phone,
        foto: mahasiswa.foto,
        nama_dosen: dosen ? dosen.nama : null,
      });

    } else if (user.role === 'dosen') {
      const dosen = await Dosen.findOne({ where: { user_id: req.user_id } });

      if (!dosen) {
        return res.status(404).send({ message: "Dosen data not found!" });
      }

      res.status(200).send({
        role: user.role,
        nip: dosen.nip,
        nama: dosen.nama,
        email: dosen.email,
        alamat: dosen.alamat ? dosen.alamat : null,
        phone: dosen.phone ? dosen.phone : null,
        foto: dosen.foto,
      });

    } else if (user.role === 'operator') {
      const operator = await Operator.findOne({ where: { user_id: req.user_id } });

      if (!operator) {
        return res.status(404).send({ message: "Operator data not found!" });
      }

      res.status(200).send({
        role: user.role,
        nip: operator.nip,
        nama: operator.nama,
        email: operator.email,
        alamat: operator.alamat ? operator.alamat : null,
        phone: operator.phone ? operator.phone : null,
        foto: operator.foto,
      });

    } else if (user.role === 'departemen') {
      const departemen = await Departemen.findOne({ where: { user_id: req.user_id } });

      if (!departemen) {
        return res.status(404).send({ message: "Departemen data not found!" });
      }

      res.status(200).send({
        role: user.role,
        nama: departemen.nama, 
        email: departemen.email,
        alamat: departemen.alamat ? departemen.alamat : null,
        phone: departemen.phone ? departemen.phone : null,
        foto: departemen.foto,
      });

    } else {
      res.status(400).send({ message: "Invalid role!" });
    }

  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.getAllAccount = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [
        { model: Mahasiswa, attributes: ['nama', 'email'], required: false },
        { model: Dosen, attributes: ['nama', 'email'], required: false },
        { model: Departemen, attributes: ['nama', 'email'], required: false }
      ],
      attributes: ['username', 'role'],
    });

    res.status(200).send(users.map((user) => {
        if (user.role === 'mahasiswa') {
          return {
            username: user.username,
            role: user.role,
            nama: user.Mahasiswa.nama,
            email: user.Mahasiswa.email,
          }
        } else if (user.role === 'dosen') {
          return {
            username: user.username,
            role: user.role,
            nama: user.Dosen.nama,
            email: user.Dosen.email,
          }
        } else {
          return {
            username: user.username,
            role: user.role,
            nama: user.Departemen.nama,
            email: user.Departemen.email,
          }
        }
      }))
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.resetPassword = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const passwordHash = bcrypt.hashSync(username, 8);
    await User.update({ password: passwordHash }, { where: { username: username } });

    res.status(200).send('Password berhasil direset');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// OPERATOR
exports.dashboardOperator = async (req, res) => {
  try {
    const sumAccount = await User.count();
    const sumMahasiswa = await User.count({ where: { role: 'mahasiswa' } });
    const sumDosen = await User.count({ where: { role: 'dosen' } });

    const sumAktif = await Mahasiswa.count({ where: { status: 'aktif' } });
    const sumCuti = await Mahasiswa.count({ where: { status: 'cuti' } });
    const sumMangkir = await Mahasiswa.count({ where: { status: 'mangkir' } });
    const sumDO = await Mahasiswa.count({ where: { status: 'do' } });
    const sumUndurDiri = await Mahasiswa.count({ where: { status: 'undur_diri' } });
    const sumLulus = await Mahasiswa.count({ where: { status: 'lulus' } });
    const sumMeninggalDunia = await Mahasiswa.count({ where: { status: 'meninggal_dunia' } });

    res.status(200).send({ 
      sumAccount: sumAccount.toString(),
      sumMahasiswa: sumMahasiswa.toString(),
      sumDosen: sumDosen.toString(),
      sumAktif: sumAktif.toString(),
      sumCuti: sumCuti.toString(),
      sumMangkir: sumMangkir.toString(),
      sumDO: sumDO.toString(),
      sumUndurDiri: sumUndurDiri.toString(),
      sumLulus: sumLulus.toString(),
      sumMeninggalDunia: sumMeninggalDunia.toString(),
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
}

exports.generate = async (req, res) => {
  try {
    const { nim, nama, angkatan, nip_dosen } = req.body;
    
    const user = await User.create({
      username: nim,
      password: nim,
      role: "mahasiswa",
    });

    await Mahasiswa.create({
      nim: nim,
      nama: nama,
      angkatan: angkatan,
      status: "aktif",
      nip_dosen: nip_dosen,
      user_id: user.id,
    });
    res.status(201).send('Akun mahasiswa dengan nama ' + nama + ' berhasil disisipkan');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getBatchTemplate = async (req, res) => {
  try {
    const template = './uploads/template.csv'
    res.download(template);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.generateBatch = async (req, res) => {
  try {
    const jsonFile = await csv().fromFile(req.file.path, { delimiter: ',' });

    const createdAccounts = [];

    await User.sequelize.transaction(async (t) => {
      for (const row of jsonFile) {
        const existingUser = await User.findOne({ where: { username: row.nim } });

        if (existingUser) {
          createdAccounts.push('Akun mahasiswa dengan nama ' + row.nama + ' sudah ada');
          continue;
        }

        const user = await User.create({
          username: row.nim,
          password: row.nim,
          role: "mahasiswa",
        }, 
        { transaction: t }
        );

        await Mahasiswa.create({
          nim: row.nim,
          nama: row.nama,
          angkatan: row.angkatan,
          status: "aktif",
          nip_dosen: row.nip_dosen,
          user_id: user.id,
        }, 
        { transaction: t }
        );
        
        createdAccounts.push('Akun mahasiswa dengan nama ' + row.nama + ' berhasil disisipkan');
      }
    })

    fs.unlinkSync(req.file.path);
    const responseMessage = createdAccounts.join('\n');
    res.status(201).send(responseMessage);

  } catch (error) {
    console.log(error);
    fs.unlinkSync(req.file.path);
    res.status(500).send({
      message: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const username = req.params.username;

    const user = await User.findOne({ where: { username: username } });
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    const isMahasiswa = await Mahasiswa.findOne({ where: { nim: username } });
    const isDosen = await Dosen.findOne({ where: { nip: username } });
    const isOperator = await Operator.findOne({ where: { nip: username } });
    const isDepartemen = await Departemen.findOne({ where: { nama: username } });

    await User.destroy({ where: { username: username } });

    res.status(200).send('Akun berhasil dihapus');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// DEPARTEMEN
exports.graphDepartemenBoard = async (req, res) => {
  try {
    const mahasiswaList = await Mahasiswa.findAll();
    const angkatanMap = new Map(); 

    for (let angkatan = 2016; angkatan <= 2023; angkatan++) {
      angkatanMap.set(angkatan.toString(), { total: 0, count: 0 });
    }

    for (const mahasiswa of mahasiswaList) {
      const angkatan = mahasiswa.angkatan.toString(); // Convert to string
      const khs = await KHS.findOne({
        where: { mahasiswa_nim: mahasiswa.nim },
        order: sequelize.literal('"semester_aktif"::int DESC'),
      });
      const ipk = khs ? parseFloat(khs.ip_kumulatif) : 0;

      if (!angkatanMap.has(angkatan)) {
        angkatanMap.set(angkatan, { total: 0, count: 0 });
      }

      const angkatanData = angkatanMap.get(angkatan);
      
      if (khs) {
        angkatanData.total += ipk;
        angkatanData.count += 1;
      }
    }

    console.log(angkatanMap);

    const jumlahMahasiswaPerAngkatan = [];
    angkatanMap.forEach((angkatanData, angkatan) => {
      const { total, count } = angkatanData;
      const rerataIpk = count > 0 ? (total / count).toFixed(2) : 0;

      jumlahMahasiswaPerAngkatan.push({
        label: angkatan,
        value: rerataIpk,
      });
    });

    res.status(200).json(jumlahMahasiswaPerAngkatan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.dashboardDepartemen = async (req, res) => {
  try {
    const sumMahasiswa = await Mahasiswa.count();
    const sumAktif = await Mahasiswa.count({ where: { status: 'aktif' } });
    const sumCuti = await Mahasiswa.count({ where: { status: 'cuti' } });
    const sumMangkir = await Mahasiswa.count({ where: { status: 'mangkir' } });
    const sumDO = await Mahasiswa.count({ where: { status: 'do' } });
    const sumUndurDiri = await Mahasiswa.count({ where: { status: 'undur_diri' } });
    const sumLulus = await Mahasiswa.count({ where: { status: 'lulus' } });
    const sumMeninggalDunia = await Mahasiswa.count({ where: { status: 'meninggal_dunia' } });

    res.status(200).send({ 
      sumMahasiswa: sumMahasiswa.toString(),
      sumAktif: sumAktif.toString(),
      sumLulus: sumLulus.toString(),
      sumCuti: sumCuti.toString(),
      sumMangkir: sumMangkir.toString(),
      sumDO: sumDO.toString(),
      sumUndurDiri: sumUndurDiri.toString(),
      sumMeninggalDunia: sumMeninggalDunia.toString(),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// DOSEN
exports.dashboardDosen = async (req, res) => {
  try {
    const dosen = req.dosen;
    const sumMahasiswa = await Mahasiswa.count({ where: { nip_dosen: dosen.nip } });
    const sumAktif = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'aktif' } });
    const sumCuti = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'cuti' } });
    const sumMangkir = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'mangkir' } });
    const sumDO = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'do' } });
    const sumUndurDiri = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'undur_diri' } });
    const sumLulus = await Mahasiswa.count({ where: { nip_dosen: dosen.nip, status: 'lulus' } });
    const sumMeninggalDunia = await Mahasiswa.count({ where : { nip_dosen: dosen.nip, status: 'meninggal_dunia' } });

    res.status(200).send({ 
      sumMahasiswa: sumMahasiswa.toString(),
      sumAktif: sumAktif.toString(),
      sumCuti: sumCuti.toString(),
      sumMangkir: sumMangkir.toString(),
      sumDO: sumDO.toString(),
      sumUndurDiri: sumUndurDiri.toString(),
      sumLulus: sumLulus.toString(),
      sumMeninggalDunia: sumMeninggalDunia.toString(),
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.ipkGraphDosenBoard = async (req, res) => {
  try {
    const dosen = req.dosen;
    const mahasiswaList = await Mahasiswa.findAll({ where: { nip_dosen: dosen.nip } });
    const angkatanMap = new Map(); 

    for (let angkatan = 2016; angkatan <= 2023; angkatan++) {
      angkatanMap.set(angkatan.toString(), { total: 0, count: 0 });
    }

    for (const mahasiswa of mahasiswaList) {
      const angkatan = mahasiswa.angkatan.toString(); // Convert to string
      const khs = await KHS.findOne({
        where: { mahasiswa_nim: mahasiswa.nim },
        order: sequelize.literal('"semester_aktif"::int DESC'),
      });
      const ipk = khs ? parseFloat(khs.ip_kumulatif) : 0;

      if (!angkatanMap.has(angkatan)) {
        angkatanMap.set(angkatan, { total: 0, count: 0 });
      }

      const angkatanData = angkatanMap.get(angkatan);
      
      if (khs) {
        angkatanData.total += ipk;
        angkatanData.count += 1;
      }
    }

    console.log(angkatanMap);

    const jumlahMahasiswaPerAngkatan = [];
    angkatanMap.forEach((angkatanData, angkatan) => {
      const { total, count } = angkatanData;
      const rerataIpk = count > 0 ? (total / count).toFixed(2) : 0;

      jumlahMahasiswaPerAngkatan.push({
        label: angkatan,
        value: rerataIpk,
      });
    });

    res.status(200).json(jumlahMahasiswaPerAngkatan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDosen = async (req, res) => {
  try {
    const t = await User.sequelize.transaction();
    const { alamat, phone } = req.body;

    const user = await User.findOne({ where: { id: req.user_id }, transaction: t });
    if (user) {
      this.changePassword(req, res);
      if (req.file) {
        await Dosen.update({ foto: req.file.path }, { where: { user_id: req.user_id } });
      }
      await Dosen.update(
        {
          alamat: alamat,
          phone: phone,
        },
        { where: { user_id: req.user_id }, transaction: t }
      );
    }
    await t.commit();
    res.status(200).send('Profile berhasil diperbarui');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllDosen = async (req, res) => {
  try {
    const dosen = await Dosen.findAll({
      attributes: [['nip', 'value'],
                  ['nama', 'label']]
  });
    res.status(200).send(dosen);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

// MAHASISWA
exports.dashboardMahasiswa = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const irs = await IRS.findOne({ 
      where: { mahasiswa_nim: mahasiswa.nim },
      order: sequelize.literal('"semester_aktif"::int DESC'), 
      });
    const khs = await KHS.findOne({ 
      where: { mahasiswa_nim: mahasiswa.nim },
      order: sequelize.literal('"semester_aktif"::int DESC'), 
      });
    const pkl = await PKL.findOne({ where: { mahasiswa_nim: mahasiswa.nim } });
    const skripsi = await Skripsi.findOne({ where: { mahasiswa_nim: mahasiswa.nim } });
    res.status(200).send({
      semester: irs ? irs.semester_aktif: null,
      ipk: khs ? khs.ip_kumulatif : null,
      pkl: pkl ? pkl.status : null,
      skripsi: skripsi ? skripsi.status : null,
      irs_statusV: irs ? irs.status_verifikasi : null,
      khs_statusV: khs ? khs.status_verifikasi : null,
      pkl_statusV: pkl ? pkl.status_verifikasi : null,
      skripsi_statusV: skripsi ? skripsi.status_verifikasi : null,
    });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.ipkGraphMahasiswaBoard = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const khsArr = [];

    const khss = await KHS.findAll({ where: { mahasiswa_nim: mahasiswa.nim } });
    for (const khs of khss) {
      khsArr.push({
        semester: khs.semester_aktif,
        ipk: khs.ip_kumulatif,
      });
    }

    res.status(200).send(khsArr);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.updateMahasiswa = async (req, res) => {
  try {
    const t = await User.sequelize.transaction();
    const { alamat, kode_kabupatenKota, kode_provinsi, jalur_masuk, email, phone, foto } = req.body;

    const user = await User.findOne({ where: { id: req.user_id }, transaction: t });
    if (user) {
      this.changePassword(req, res);
      console.log(req.file);
      if (req.file) {
        await Mahasiswa.update({ foto: req.file.path }, { where: { user_id: req.user_id } });
      }
      await Mahasiswa.update(
        {
          alamat: alamat,
          kode_kabupatenKota: kode_kabupatenKota,
          kode_provinsi: kode_provinsi,
          jalur_masuk: jalur_masuk,
          email: email,
          phone: phone,
          foto: foto,
        },
        { where: { user_id: req.user_id }, transaction: t }
      );
    }
    await t.commit();
    res.status(200).send('Profile berhasil diperbarui');
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll();
    res.status(200).send(mahasiswa);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswaCount = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.count();
    res.status(200).send(mahasiswa.toString());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswaLulusCount = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.count({ where: { status: 'lulus' } });
    res.status(200).send(mahasiswa.toString());
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllMahasiswaByDosen = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({ where: { nip_dosen: req.dosen.nip } });
    res.status(200).send(mahasiswa);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}

exports.getAllAcademicByMahasiswa = async (req, res) => {
  try {
    const mahasiswa = req.mahasiswa;
    const academicData = [];

    for (let semester = 1; semester <= 14; semester++) {
      const khs = await KHS.findOne({ where: { mahasiswa_nim: mahasiswa.nim, semester_aktif: semester.toString() } });
      const pkl = await PKL.findOne({ where: { mahasiswa_nim: mahasiswa.nim, semester: semester.toString() } });
      const skripsi = await Skripsi.findOne({ where: { mahasiswa_nim: mahasiswa.nim, semester: semester.toString() } });
      const irs = await IRS.findOne({ where: { mahasiswa_nim: mahasiswa.nim, semester_aktif: semester.toString() } });

      const academicRecord = {
        semester: semester,
        irs_status: irs ? true : false,
        khs_status: khs ? true : false,
        pkl_status: pkl ? true : false,
        skripsi_status: skripsi ? true : false,
        irs_file: irs ? irs.file : null,
        khs_file: khs ? khs.file : null,
        sks: irs ? irs.sks : null,
        sks_semester: khs ? khs.semester_aktif : null,
        ip_semester: khs ? khs.ip_semester : null,
        sks_kumulatif: khs ? khs.sks_kumulatif : null,
        ip_kumulatif: khs ? khs.ip_kumulatif : null,
      };

      academicData.push(academicRecord);
    }

    res.status(200).send(academicData);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
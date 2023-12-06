const { User, Mahasiswa, Dosen, KabupatenKota, Provinsi, Operator, Departemen } = require("../models");
const csv = require('csvtojson');
const fs = require('fs');
const bcrypt = require('bcryptjs');

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
    const user = await User.findOne({ where: { id: req.user_id } });

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


// OPERATOR
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

// DEPARTEMEN

// DOSEN
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

exports.getAllMahasiswaByDosen = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findAll({ where: { nip_dosen: req.dosen.nip } });
    res.status(200).send(mahasiswa);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
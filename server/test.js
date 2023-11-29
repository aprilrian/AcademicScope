require("dotenv").config();
const { Mahasiswa, IRS } = require('./app/models');

// Mendefinisikan fungsi async yang akan mengandung kode Anda
const mainFunction = async () => {
    try {
        const mahasiswa = await Mahasiswa.findOne({
            where: {
                alamat: "Rantosss",
            },
        });

        const irsdata = await IRS.create({
            semester_aktif: '1',
            sks: 24,
            status_verifikasi: 'belum',
        });

        await mahasiswa.createIRS({
            semester_aktif: '1',
            sks: 24,
            status_verifikasi: 'belum',
        });

        // Tempatkan logika berikut jika diperlukan setelah operasi yang menunggu
        console.log('Operasi selesai dengan sukses.');
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Panggil fungsi async
mainFunction();

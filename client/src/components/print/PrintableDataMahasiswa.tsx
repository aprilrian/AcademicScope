import React from 'react';

const PrintableDataMahasiswa = () => {
  const print = (id: string) => {
    let printContents: any = document.getElementById(id)?.innerHTML;
    let originalContents: any = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  return (
    <div>
      <h1>Data Mahasiswa</h1>
      <p>Nama: John Doe</p>
      <p>NIM: 123456</p>
      <button onClick={() => print('printableData')}>
        Cetak Data Mahasiswa
      </button>
      <div id="printableData">
        {/* Isi dengan data mahasiswa yang ingin dicetak */}
        <p>Nama: John Doe</p>
        <p>NIM: 123456</p>
      </div>
    </div>
  );
};

export default PrintableDataMahasiswa;

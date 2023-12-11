const url = "http://localhost:8080/mahasiswa/irs/submit";
const urlSplit = url.split("/");
const jenisFolder = urlSplit[urlSplit.length - 2];

console.log(jenisFolder);
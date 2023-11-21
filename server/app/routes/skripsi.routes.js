const controller = require("../controllers/skripsi.controller");

module.exports = function (app) {
  app.post("/skripsi", controller.submitSkripsi);

  app.get("/skripsi", controller.getSkripsi);

  app.get("/all-skripsi", controller.getRekap);

  app.get("/skripsi/:nim", controller.downloadSkripsi);

  app.get("/rekap/skripsi", controller.waliSkripsi);

  app.get("/verifikasi/skripsi", controller.getVerifikasiSkripsi);

  app.post("/verifikasi/skripsi/:nim", controller.verifSkripsi);
};

const controller = require("../controllers/khs.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/khs", controller.submitKHS);

  app.get("/khs", controller.getKHS);

  app.get("/all-khs", controller.getAllKHS);

  app.get("/khs/:nim/:semester", controller.downloadKHS);

  app.get("/rekap/khs", controller.waliKHS);

  app.get("/verifikasi/khs", controller.notVerifiedKHS);

  app.get("/verifikasi/khs-sudah", controller.verifiedKHS);

  app.post("/verifikasi/khs/:nim/:semester", controller.verifyKHS);

  app.get("/khs/:nim/:semester_aktif", controller.downloadKHS);

  // app.delete(
  //     "/delete/all-khs",
  //     controller.deleteAllKHS
  // );

  app.get("/khs/:nim/:semester_aktif", controller.downloadKHS);
};

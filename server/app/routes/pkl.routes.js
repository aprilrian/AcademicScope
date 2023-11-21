const controller = require("../controllers/pkl.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/pkl", controller.submitPKL);

  app.get("/pkl", controller.getPKL);

  app.get("/all-pkl", controller.getRekapPKL);

  app.get("/rekap/pkl", controller.getWaliPKL);

  app.get("/verifikasi/pkl", controller.getBelumPKL);

  app.post("/verifikasi/pkl/:nim", controller.VerifPKL);

  app.get("/pkl/:nim", controller.downloadPKL);

  // app.delete(
  //     "/delete/all-pkl",
  //     controller.deleteAllPKL
  // );
};

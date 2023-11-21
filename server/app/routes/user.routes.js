const authMiddleware = require("../middlewares/auth.middleware");
const controller = require('../controllers/user.controller');

module.exports = function (app) {
    app.use(function (req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });
  
    app.get("/all", controller.allAccess);
  
    app.get("/mahasiswa", [authMiddleware.verifyToken], controller.mahasiswaBoard);
  
    app.get(
      "/dosen",
      [authMiddleware.verifyToken, authMiddleware.isDosen],
      controller.dosenBoard
    );
  
    app.get(
      "/operator",
      [authMiddleware.verifyToken, authMiddleware.isAdmin],
      controller.operatorBoard
    );
  
    app.get(
      "/departemen",
      [authMiddleware.verifyToken, authMiddleware.isDepartemen],
      controller.departemenBoard
    );

    app.post("/signup", controller.signup);
}
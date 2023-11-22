const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const { User, Role, Mahasiswa, Dosen } = require("../models");

//get mahasiswa id
getMahasiswaId = (req, res, next) => {
    Mahasiswa.findOne({
        user: req.userId,
    }).exec((err, mahasiswa) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        req.mahasiswaId = mahasiswa._id;
        next();
    });
};

//getmahasiswaid from nim parameter if not exist return 404
getMahasiswaIdFromNim = (req, res, next) => {
    Mahasiswa.findOne({
        nim: req.params.nim,
    }).exec((err, mahasiswa) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!mahasiswa) {
            res.status(404).send({ message: "Mahasiswa not found" });
            return;
        }
        req.mahasiswaId = mahasiswa._id;
        next();
    });
};

verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Token expired!' });
      }
      return res.status(401).json({ message: 'Unauthorized!' });
    }

    req.user_id = decoded.id;
    next();
  });
};

isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user_id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
    
        if (user.role === 'operator') {
            return next();
        } else { 
            return res.status(403).send({ message: 'Require Admin Role!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
      }
};

isMahasiswa = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "mahasiswa") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Mahasiswa Role!" });
                return;
            }
        );
    });
};
isDosen = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "dosen") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Dosen Role!" });
                return;
            }
        );
    });
};
isDepartemen = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "departemen") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Departemen Role!" });
                return;
            }
        );
    });
};
isMaster = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "departemen" || roles[i].name === "admin") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Departemen Role!" });
                return;
            }
        );
    });
};

const isMahasiswaOrDosen = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "mahasiswa" || roles[i].name === "dosen") {
                        next();
                        return;
                    }
                }
                res.status(403).send({ message: "Require Mahasiswa or Dosen Role!" });
                return;
            }
        );
    });
};

//only kodewali can access mahasiswa file
const isKodeWali = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }
                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "mahasiswa") {
                        next();
                        return;
                    } else if (roles[i].name === "dosen") {
                        Dosen.findOne({ user: req.userId }).exec((err, dosen) => {
                            if (err) {
                                res.status(500).send({ message: err });
                                return;
                            }
                            //get mahasiswa id from params
                            Mahasiswa.findById(req.mahasiswaId).exec((err, mahasiswa) => {
                                if (err) {
                                    res.status(500).send({ message: err });
                                    return;
                                }
                                //compare dosen id with mahasiswa kodewali
                                if (dosen.id == mahasiswa.kodeWali) {
                                    next();
                                    return;
                                }
                                res.status(403).send({ message: "You're not dosen wali" });
                                return;
                            });
                        });
                    }
                }
            }
        );
    });
};

const authMiddleware = {
    verifyToken,
    isAdmin,
    isDosen,
    isDepartemen,
    isMahasiswa,
    getMahasiswaId,
    isMaster,
    isMahasiswaOrDosen,
    getMahasiswaIdFromNim,
    isKodeWali,
};
module.exports = authMiddleware;
const SECRET = process.env.SECRET;
const jwt = require("jsonwebtoken");
const { User, Mahasiswa, Dosen } = require("../models");

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
    req.user_nama = decoded.nama;
    req.user_username = decoded.username;
    next();
  });
};

isOperator = async (req, res, next) => {
    try {
        console.log(req.user_id);
        const user = await User.findByPk(req.user_id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
    
        if (user.role === 'operator') {
            next();
        } else { 
            return res.status(403).send({ message: 'Require Operator Role!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
      }
};

isMahasiswa = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user_id);

    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.role === 'mahasiswa') {
      next();
    } else {
      res.status(403).send({ message: 'Require Mahasiswa Role!' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: error.message });
  }
};

isDosen = async (req, res, next) => {
    try {
        console.log(req.user_id);
        const user = await User.findByPk(req.user_id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
    
        if (user.role === 'dosen') {
            next();
        } else { 
            return res.status(403).send({ message: 'Require Dosen Role!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
      }
};

isDepartemen = async (req, res, next) => {
    try {
        console.log(req.user_id);
        const user = await User.findByPk(req.user_id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
    
        if (user.role === 'departemen') {
            next();
        } else { 
            return res.status(403).send({ message: 'Require Departemen Role!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
      }
};

isMaster = async (req, res, next) => {
    try {
        console.log(req.user_id);
        const user = await User.findByPk(req.user_id);
    
        if (!user) {
          return res.status(404).send({ message: 'User not found.' });
        }
    
        if (user.role === 'operator' || user.role === 'departemen') {
            next();
        } else { 
            return res.status(403).send({ message: 'Require Master Role!' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).send({ message: error.message || 'Internal Server Error' });
      }
};

isMahasiswaOrDosen = (req, res, next) => {
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

isDosenWali = (req, res, next) => {
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
    isOperator,
    isDosen,
    isDepartemen,
    isMahasiswa,
    isMaster,
    isMahasiswaOrDosen,
    isDosenWali,
}

module.exports = authMiddleware
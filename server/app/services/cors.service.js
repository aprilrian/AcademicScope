const cors = require('cors');

var corsOptions = {
  origin: 'http://localhost:' + (process.env.CLIENT_PORT || 3000),
  optionsSuccessStatus: 200
};

module.exports = cors(corsOptions);

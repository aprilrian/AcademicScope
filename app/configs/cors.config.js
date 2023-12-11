const cors = require("cors");

const corsOptions = {
    origin: ["http://localhost:3000", "http://localhost:8080"],
};

const corsConfig = cors(corsOptions);

module.exports = corsConfig;
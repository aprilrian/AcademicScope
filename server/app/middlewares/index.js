const authMiddleware = require("../middlewares/auth.middleware");
const userMiddleware = require("./user.middleware");

module.exports = {
    authMiddleware,
    userMiddleware
}
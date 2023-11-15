const pgp = require('pg-promise')(/* options */)
const db = pgp('postgres://christianjoshua:christianjoshua@localhost:5432/postgres')

module.exports = db
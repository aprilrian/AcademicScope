require('dotenv').config()

// Initialize express app and listen for incoming requests
const express = require('express')
const app = express()
const port = 3000
const cors = require('cors')
const db = require('./db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')

// Middleware
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

// Routes
app.post('/token', async (req, res) => {
  try {
    const token = req.body.refreshToken
    const refreshTokens = await db.query(`SELECT * FROM public."refreshTokens" WHERE tokens = $1`, [token])

    if (token == null) return res.sendStatus(401)
    
    if (!refreshTokens[0]) return res.sendStatus(403)
    
    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      const accessToken = generateAccessToken({ username: user.username })
      res.json({ accessToken: accessToken })
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Gagal memproses permintaan token' });
  }
})


app.get('/users', authenticateToken, async (req, res) => {
  const users = await db.query(`SELECT * FROM users`)
  res.json(users.filter(user => user.username === req.user.username))
})

app.post('/register', async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10)
  const { username, email, password, role } = req.body
  try {
    const user = await db.query(`
      INSERT INTO users (username, email, password, role)
      VALUES ($1, $2, $3, $4)
    `, [username, email, hashedPassword, role])

    res.status(201).send('Akun berhasil disisipkan');

  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Gagal menyisipkan data akun' });
  }
})

app.post('/login', async (req, res) => {
  const users = await db.query(`SELECT * FROM users`)
  const user = users.find(user => user.username === req.body.username)
  if (user == null) {
    return res.status(400).send('Tidak dapat menemukan user')
  } 
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      // res.send('Login berhasil')

      const accessToken = generateAccessToken(user)
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
      await db.query(`
        INSERT INTO public."refreshTokens" (tokens)
        VALUES ($1)
      `, [refreshToken])
      res.json({ accessToken: accessToken, refreshToken: refreshToken })
    } else {
      res.status(401).send('Username atau password salah')
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Gagal login' });
  }
})

app.delete('/logout', async (req, res) => {
  try {
    await db.query(`
      DELETE FROM public."refreshTokens" WHERE tokens = $1
    `, [req.body.refreshToken])
    res.status(204).send('Berhasil logout')
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ error: 'Gagal logout' });
  }
})

// Start server
app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
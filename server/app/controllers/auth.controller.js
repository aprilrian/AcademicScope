const { ACC_SECRET, REF_SECRET} = require("../config/auth.config.js");
const jwt = require("jsonwebtoken");
const db = require("../models");

exports.signin = (req, res) => {
    const users = await db.query('SELECT * FROM public.users')
    const user = users.find(user => user.email === req.body.email)
    if (user == null) {
      return res.status(400).send('Tidak dapat menemukan user')
    } 
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        await db.query(`
          INSERT INTO public."refreshTokens" (token)
          VALUES ($1)
        `, [refreshToken])
        const responseData = {
          ...user,  // Spread user properties
          accessToken: accessToken,
          refreshToken: refreshToken
        }
        res.json(responseData)
      } else {
        res.status(401).send('Username atau password salah')
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Gagal login' });
    }
};
  
app.delete('/logout', async (req, res) => {
    try {
      await db.query(`
        DELETE FROM public."refreshTokens" WHERE tokens = $1
      `, [req.body.refreshToken])
      res.status(204).send('Berhasil logout')
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Gagal logout' });
    }
  });

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
  });
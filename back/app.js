require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/home.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/login.html'));
});
app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/register.html'));
});
app.get('/otp-verify', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/otp_verify.html'));
});
app.get('/etudiants', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/etudiant_list.html'));
});
app.get('/intervenants', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/intervenant_list.html'));
});

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.listen(3000, () => console.log('Server running on http://localhost:3000'));

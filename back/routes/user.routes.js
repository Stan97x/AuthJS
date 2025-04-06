const express = require('express');
const router = express.Router();
const users = require('../models/user.model');
const { verifyToken } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { verifyOTP } = require('../middleware/otp.middleware');

router.get('/details/:id', verifyToken, (req, res) => {
  if (req.user.role !== 'student') {
    return res.status(403).json({ message: 'Seuls les étudiants peuvent accéder à cette page' });
  }

  if (req.user.id !== req.params.id) {
    return res.status(403).json({ message: 'Vous ne pouvez accéder qu’à vos propres informations' });
  }

  const student = users.find(u => u.id === req.params.id);
  if (!student) return res.status(404).json({ message: 'Étudiant non trouvé' });

  res.json(student);
});

router.get('/etudiants', verifyToken, allowRoles('teacher', 'admin'), (req, res) => {
  const students = users.filter(u => u.role === 'student');
  res.json(students);
});


router.post('/intervenants', verifyToken, allowRoles('admin'), verifyOTP, (req, res) => {
  const teachers = users.filter(u => u.role === 'teacher');
  res.json(teachers);
});

module.exports = router;

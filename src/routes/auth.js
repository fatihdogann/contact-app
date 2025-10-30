const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const usersStore = require('../db/usersStore');
const { generateToken, authenticate } = require('../middleware/auth');

// POST /api/auth/register - User registration
router.post('/register', [
  body('fullName').trim().notEmpty().withMessage('Ad Soyad gerekli'),
  body('phone').trim().notEmpty().withMessage('Telefon gerekli'),
  body('email').trim().isEmail().withMessage('Geçerli bir e-posta adresi girin'),
  body('password').isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Geçerli bir yaş girin'),
  body('province').trim().notEmpty().withMessage('İl gerekli'),
  body('district').trim().notEmpty().withMessage('İlçe gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { fullName, phone, email, password, age, province, district, gender } = req.body;

    const user = await usersStore.create({
      fullName,
      phone,
      email,
      password,
      age,
      province,
      district,
      gender
    });

    res.status(201).json({
      message: 'Kayıt başarılı! Hesabınız onay bekliyor.',
      user
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || 'Kayıt hatası' });
  }
});

// POST /api/auth/login - User login
router.post('/login', [
  body('email').trim().isEmail().withMessage('Geçerli bir e-posta adresi girin'),
  body('password').notEmpty().withMessage('Şifre gerekli')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await usersStore.getByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }

    const isValidPassword = await usersStore.verifyPassword(user, password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'E-posta veya şifre hatalı' });
    }

    if (!user.approved) {
      return res.status(403).json({ error: 'Hesabınız henüz onaylanmamış. Lütfen admin onayını bekleyin.' });
    }

    const token = generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Giriş başarılı',
      token,
      user: userWithoutPassword
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Giriş hatası' });
  }
});

// GET /api/auth/me - Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await usersStore.getById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }

    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcı bilgisi alınamadı' });
  }
});

module.exports = router;

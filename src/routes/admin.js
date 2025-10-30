const express = require('express');
const router = express.Router();
const usersStore = require('../db/usersStore');
const { authenticate, requireAdmin } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(requireAdmin);

// GET /api/admin/users - Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await usersStore.getAllUsersWithoutPassword();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcılar listelenemedi' });
  }
});

// GET /api/admin/users/pending - Get pending approval users
router.get('/users/pending', async (req, res) => {
  try {
    const users = await usersStore.getPendingUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Onay bekleyen kullanıcılar listelenemedi' });
  }
});

// PUT /api/admin/users/:id/approve - Approve a user
router.put('/users/:id/approve', async (req, res) => {
  try {
    const user = await usersStore.updateApprovalStatus(req.params.id, true);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json({ message: 'Kullanıcı onaylandı', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcı onaylanamadı' });
  }
});

// PUT /api/admin/users/:id/reject - Reject a user
router.put('/users/:id/reject', async (req, res) => {
  try {
    const user = await usersStore.updateApprovalStatus(req.params.id, false);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json({ message: 'Kullanıcı onayı reddedildi', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcı onayı reddedilemedi' });
  }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Geçersiz rol. admin veya user olmalı' });
    }

    const user = await usersStore.setRole(req.params.id, role);
    if (!user) {
      return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    }
    res.json({ message: 'Kullanıcı rolü güncellendi', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kullanıcı rolü güncellenemedi' });
  }
});

// GET /api/admin/contacts - Get all contacts (admin sees all)
router.get('/contacts', async (req, res) => {
  try {
    const contactsStore = require('../db/contactsStore');
    const contacts = await contactsStore.getAll();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rehber listelenemedi' });
  }
});

module.exports = router;

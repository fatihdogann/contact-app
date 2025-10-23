const express = require('express');
const router = express.Router();
const store = require('../db/contactsStore');
const { isValidName, normalizePhoneTr } = require('../utils/validators');

// GET /api/contacts - list all
router.get('/', async (req, res) => {
  try {
    const items = await store.getAll();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/search?q=
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    const items = await store.search(q);
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/:id - get one
router.get('/:id', async (req, res) => {
  try {
    const item = await store.getById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contacts - create
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body || {};
    if (!firstName || !lastName || !phone) {
      return res.status(400).json({ error: 'firstName, lastName and phone are required' });
    }
    if (!isValidName(firstName)) {
      return res.status(400).json({ error: 'Invalid firstName: only letters allowed' });
    }
    if (!isValidName(lastName)) {
      return res.status(400).json({ error: 'Invalid lastName: only letters allowed' });
    }
    const normalized = normalizePhoneTr(phone);
    if (!normalized) {
      return res.status(400).json({ error: 'Invalid Turkish phone number' });
    }
    const created = await store.add({ firstName: firstName.trim(), lastName: lastName.trim(), phone: normalized });
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/contacts/:id - update
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body || {};
    if (!firstName && !lastName && !phone) {
      return res.status(400).json({ error: 'Provide at least one of firstName, lastName, phone' });
    }
    const payload = {};
    if (firstName !== undefined) {
      if (!isValidName(firstName)) {
        return res.status(400).json({ error: 'Invalid firstName: only letters allowed' });
      }
      payload.firstName = firstName.trim();
    }
    if (lastName !== undefined) {
      if (!isValidName(lastName)) {
        return res.status(400).json({ error: 'Invalid lastName: only letters allowed' });
      }
      payload.lastName = lastName.trim();
    }
    if (phone !== undefined) {
      const normalized = normalizePhoneTr(phone);
      if (!normalized) {
        return res.status(400).json({ error: 'Invalid Turkish phone number' });
      }
      payload.phone = normalized;
    }
    const updated = await store.update(req.params.id, payload);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE /api/contacts/:id - delete
router.delete('/:id', async (req, res) => {
  try {
    const ok = await store.remove(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

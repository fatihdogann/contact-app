const express = require('express');
const router = express.Router();
const store = require('../db/contactsStore');

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
    const created = await store.add({ firstName, lastName, phone });
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
    const updated = await store.update(req.params.id, { firstName, lastName, phone });
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

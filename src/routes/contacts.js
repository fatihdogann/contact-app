const express = require('express');
const router = express.Router();
const store = require('../db/contactsStore');
const usersStore = require('../db/usersStore');
const { isValidName, normalizePhoneTr } = require('../utils/validators');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// GET /api/contacts - list all (filtered by user, optionally by category)
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let items;
    
    if (category) {
      items = await store.filterByCategory(category, req.user.id);
    } else {
      items = await store.getAllByUserId(req.user.id);
    }
    
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
    const category = req.query.category;
    let items = await store.search(q, req.user.id);
    if (category) {
      items = items.filter(it => it.category === category);
    }
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/categories - get user's categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await store.getCategories(req.user.id);
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/contacts/:id - get one
router.get('/:id', async (req, res) => {
  try {
    const item = await store.getByIdAndUserId(req.params.id, req.user.id);
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
    const { firstName, lastName, phone, category } = req.body || {};
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
    
    // Check storage limit (estimate ~1KB per contact)
    const contactSize = 1024; // 1 KB per contact
    const storageCheck = await usersStore.checkStorageLimit(req.user.id, contactSize);
    
    if (!storageCheck.allowed) {
      return res.status(413).json({ 
        error: storageCheck.message,
        storageInfo: {
          used: storageCheck.used,
          limit: storageCheck.limit,
          remaining: storageCheck.remaining
        }
      });
    }
    
    const created = await store.add({ 
      firstName: firstName.trim(), 
      lastName: lastName.trim(), 
      phone: normalized,
      userId: req.user.id,
      category: category ? category.trim() : null
    });
    
    // Update storage used
    const newStorageUsed = storageCheck.used + contactSize;
    await usersStore.updateStorageUsed(req.user.id, newStorageUsed);
    
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT /api/contacts/:id - update
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, phone, category } = req.body || {};
    if (!firstName && !lastName && !phone && category === undefined) {
      return res.status(400).json({ error: 'Provide at least one of firstName, lastName, phone, category' });
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
    if (category !== undefined) {
      payload.category = category ? category.trim() : null;
    }
    const updated = await store.update(req.params.id, payload, req.user.id);
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
    const ok = await store.remove(req.params.id, req.user.id);
    if (!ok) return res.status(404).json({ error: 'Not found' });
    
    // Update storage used (reduce by ~1KB per contact)
    const user = await usersStore.getById(req.user.id);
    const contactSize = 1024;
    const newStorageUsed = Math.max(0, (user.storageUsed || 0) - contactSize);
    await usersStore.updateStorageUsed(req.user.id, newStorageUsed);
    
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

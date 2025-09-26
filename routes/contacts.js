const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Tüm kişileri getir
router.get('/', contactController.getAllContacts);

// ID'ye göre kişi getir
router.get('/:id', contactController.getContactById);

// Yeni kişi ekle
router.post('/', contactController.createContact);

// Kişi güncelle
router.put('/:id', contactController.updateContact);

// Kişi sil
router.delete('/:id', contactController.deleteContact);

// Arama yap
router.get('/search', contactController.searchContacts);

module.exports = router;
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Tüm kişileri getir
router.get('/', contactController.getAllContacts);

// Arama yap (önce tanımla: '/:id' ile çakışmasın)
router.get('/search', contactController.searchContacts);

// ID'ye göre kişi getir
router.get('/:id', contactController.getContactById);

// Yeni kişi ekle
router.post('/', contactController.createContact);

// Kişi güncelle
router.put('/:id', contactController.updateContact);

// Kişi sil
router.delete('/:id', contactController.deleteContact);

module.exports = router;

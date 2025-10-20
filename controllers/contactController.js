const Contact = require('../models/Contact');

// Tüm kişileri getir
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ID'ye göre kişi getir
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Kişi bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yeni kişi ekle
exports.createContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json(contact);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Kişi güncelle
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.update(req.body);
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Kişi bulunamadı' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Kişi sil
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByPk(req.params.id);
    if (contact) {
      await contact.destroy();
      res.json({ message: 'Kişi silindi' });
    } else {
      res.status(404).json({ error: 'Kişi bulunamadı' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Arama yap
exports.searchContacts = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Arama terimi gerekli' });
    }
    
    const contacts = await Contact.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { firstName: { [require('sequelize').Op.like]: `%${q}%` } },
          { lastName: { [require('sequelize').Op.like]: `%${q}%` } },
          { phone: { [require('sequelize').Op.like]: `%${q}%` } }
        ]
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
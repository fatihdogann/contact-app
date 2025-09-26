const express = require('express');
const sequelize = require('./config/db');
const contactRoutes = require('./routes/contacts');

const app = express();
const PORT = process.env.PORT || process.env.APPLICATION_PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/contacts', contactRoutes);

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Veritabanı senkronizasyonu ve server başlatma
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı.');
    
    await sequelize.sync({ alter: true });
    console.log('Veritabanı senkronizasyonu tamamlandı.');
    
    app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor...`);
    });
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
  }
};

startServer();
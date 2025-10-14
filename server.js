require('dotenv').config();
const path = require('path');
const express = require('express');

// Güvenlik paketi (Plesk için önerilir)
const helmet = require('helmet');

const sequelize = require('./config/db');
const contactRoutes = require('./routes/contacts');

const app = express();

// Use Plesk-specific port or default
const PORT = process.env.PORT || process.env.APPLICATION_PORT || process.env.npm_package_config_port || 3000;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all interfaces for Plesk

// Güvenlik middleware'leri
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/contacts', contactRoutes);

// Sağlık kontrolü (Plesk için basit kontrol)
app.get('/health', (req, res) => {
  res.status(200).send('ok');
});

// Ana sayfa
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Hata handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Bir hata oluştu' });
});

// 404_handling middleware
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Sayfa bulunamadı' });
});

// Veritabanı senkronizasyonu ve server başlatma
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı.');
    
    await sequelize.sync({ alter: true });
    console.log('Veritabanı senkronizasyonu tamamlandı.');
    
    const server = app.listen(PORT, () => {
      console.log(`Server ${PORT} portunda çalışıyor...`);
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
    
    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully');
      server.close(() => {
        console.log('Process terminated');
      });
    });
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
    process.exit(1);
  }
};

startServer();

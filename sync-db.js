const sequelize = require('./config/db');
const Contact = require('./models/Contact');

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Veritabanı bağlantısı başarılı.');
    
    await sequelize.sync({ alter: true });
    console.log('Veritabanı senkronizasyonu tamamlandı.');
  } catch (error) {
    console.error('Veritabanı bağlantı hatası:', error);
  }
};

syncDatabase();
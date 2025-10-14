# Contact App - Rehber Uygulaması

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v18.0%2B-green)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-framework-orange)](https://expressjs.com/)

Basit bir rehber (contact) uygulaması. JSON dosyası üzerinden kalıcı veri tutar, minimal bir arayüz ile gelir.

## 📋 Özellikler

- ✅ Kişi ekleme
- ✅ Kişi listeleme
- ✅ Kişi düzenleme
- ✅ Kişi silme
- ✅ Arama (isim, soyisim veya telefon)
- ✅ RESTful API
- ✅ JSON dosya tabanlı veri saklama

## 🚀 API Endpointleri

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| `GET` | `/api/contacts` | Tüm kişileri getir |
| `GET` | `/api/contacts/:id` | Belirli bir kişiyi getir |
| `POST` | `/api/contacts` | Yeni kişi ekle |
| `PUT` | `/api/contacts/:id` | Kişi güncelle |
| `DELETE` | `/api/contacts/:id` | Kişi sil |
| `GET` | `/api/contacts/search?q=:query` | Kişilerde arama yap |

## 🛠️ Kurulum

1. **Depoyu klonlayın**:
```bash
git clone https://github.com/fatihdogann/contact-app.git
cd contact-app
```

2. **Bağımlılıkları yükleyin**:
```bash
npm install
```

3. **Uygulamayı başlatın**:
```bash
# Geliştirme modunda (nodemon ile)
npm run dev

# veya üretim modunda
npm start
```

4. **Tarayıcıda görüntüleyin**:
   - Arayüz: http://localhost:3000
   - API: http://localhost:3000/api/contacts

## 📁 Proje Yapısı

```
contact-app/
├── public/              # Frontend dosyaları
│   ├── index.html       # Ana HTML sayfası
│   ├── app.js           # Frontend JavaScript kodları
│   └── styles.css       # Stil dosyaları
├── src/
│   ├── server.js        # Express sunucusu
│   ├── routes/
│   │   └── contacts.js  # REST API rotaları
│   └── db/
│       └── contactsStore.js # Veri katmanı
├── data/
│   └── contacts.json    # Veri deposu (otomatik oluşturulur)
├── package.json         # Proje bağımlılıkları ve scriptler
└── README.md            # Bu dosya
```

## 🤝 Katkıda Bulunma

Katkıda bulunmak isterseniz, lütfen önce bir issue oluşturarak ne yapmak istediğinizi belirtin. Pull request'lerinizin incelenmesi ve kabul edilmesi için bu önemli bir adımdır.

## 📄 Lisans

Bu proje MIT Lisansı ile lisanslanmıştır - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🐛 Hata Bildirimi

Hataları veya geliştirme önerilerinizi [Issues](https://github.com/fatihdogann/contact-app/issues) sekmesinden bildirebilirsiniz.

## 👨‍💻 Geliştirici

- [Fatih Doğan](https://github.com/fatihdogann)

---

> Bu proje eğitim amaçlı geliştirilmiştir.

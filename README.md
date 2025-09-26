# Rehber Uygulaması

Bu proje Node.js, Express ve MySQL kullanılarak oluşturulmuş bir rehber uygulamasıdır.

## Kurulum

1. **Gereksinimler:**
   - Node.js (v14 veya üzeri)
   - MySQL veritabanı

2. **Bağımlılıkların yüklenmesi:**
   ```bash
   npm install
   ```

3. **Veritabanı yapılandırması:**
   - MySQL'de bir veritabanı oluşturun:
     ```sql
     CREATE DATABASE contact_db;
     ```
   - `.env` dosyasındaki veritabanı bilgilerini kendi sistemine göre güncelleyin:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=
     DB_NAME=contact_db
     ```

4. **Veritabanı senkronizasyonu:**
   ```bash
   node sync-db.js
   ```

5. **Uygulamanın başlatılması:**
   ```bash
   npm start
   ```

6. **Geliştirme modunda çalıştırma:**
   ```bash
   npm run dev
   ```

## Kullanım

Uygulama başlatıldıktan sonra tarayıcınızda `http://localhost:3000` adresine gidin.

### Özellikler:
- Kişi ekleme
- Kişi listeleme
- Kişi düzenleme
- Kişi silme
- Arama (isim, soyisim veya telefon numarasına göre)

## API Endpointleri

- `GET /api/contacts` - Tüm kişileri getir
- `GET /api/contacts/:id` - Belirli bir kişiyi getir
- `POST /api/contacts` - Yeni kişi ekle
- `PUT /api/contacts/:id` - Kişi güncelle
- `DELETE /api/contacts/:id` - Kişi sil
- `GET /api/contacts/search?q=:query` - Kişilerde arama yap

## Katkıda Bulunma

1. Forklayın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Yeni bir Pull Request oluşturun
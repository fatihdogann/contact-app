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

## Plesk Sunucu Dağıtımı

Plesk üzerinde uygulamanızı dağıtmak için aşağıdaki adımları izleyin:

### 1. Plesk Arayüzünden Kurulum

1. Plesk paneline giriş yapın
2. Sol menüden "Uygulama Yöneticisi" veya "Node.js Uygulamaları"nı seçin
3. "Node.js uygulaması ekle" seçeneğine tıklayın
4. Domain seçin ve uygulama kök dizini olarak ana dizini (`/` veya `/contact-app`) seçin
5. Uygulama adını belirleyin

### 2. Deployment Ayarları

- **Uygulama kökü:** depo dizini (ör. `contact-app`).
- **Başlangıç dosyası:** `server.js` (Plesk arayüzünde Startup file olarak ayarlayın).
- **Node.js sürümü:** Projenizde `package.json` dosyasında belirtilen `>=14` sürümüne uygun sürümü seçin.
- **Uygulama etkin:** kutuyu işaretleyin

### 3. Ortam Değişkenleri (Environment Variables)

Plesk panelinde "Uygulama yöneticisi" > "Ortam Değişkenleri" bölümünden aşağıdaki değişkenleri ekleyin:

```
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
PORT=3000  # Plesk genellikle otomatik atar, ancak belirtmek isterseniz
```

### 4. Bağımlılıkların Kurulması

Plesk uygulama arayüzünde "Yönet" > "Konsol" sekmesine giderek aşağıdaki komutu çalıştırın:

```bash
npm install
```

Veya Plesk arayüzünde "Kurulum" sekmesinden "npm install" komutunu çalıştırın.

### 5. Veritabanı Senkronizasyonu

Uygulamayı ilk kez dağıttığınızda ve her büyük güncellemeden sonra veritabanınızı senkronize etmeniz gerekir. Plesk konsolunda aşağıdaki komutu çalıştırın:

```bash
npm run sync-db
```

Alternatif olarak doğrudan Node.js komutunu kullanabilirsiniz:
```bash
node sync-db.js
```

### 6. Uygulama Yeniden Başlatma

Her değişiklikten sonra uygulamayı yeniden başlatmanız gerekir:
- Plesk arayüzünde "Uygulama yöneticisi" > "Yeniden başlat" butonuna tıklayın

### 7. Sağlık Kontrolü

Uygulama sağlıklı çalışıyorsa `GET /health` endpoint'ine yapılan istek `ok` döner. Bu endpoint Plesk'in uygulama durumunu kontrol etmek için kullanılabilir.

### 8. Hata Ayıklama

Eğer sorunla karşılaşırsanız:
- Plesk arayüzünde "Uygulama yöneticisi" > "Günlükler" sekmesinden hata günlüklerini kontrol edin
- Ortam değişkenlerinin doğru girildiğinden emin olun
- Veritabanı bağlantısının geçerli olduğundan emin olun
- `NODE_ENV` değişkeninin `production` olarak ayarlandığından emin olun
- Plesk uygulama konsolunda `npm run sync-db` komutunun başarıyla çalıştırıldığından emin olun

## Katkıda Bulunma

1. Forklayın
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Yeni bir Pull Request oluşturun

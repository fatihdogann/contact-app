# Mehmet Fatih Doğan rehber uygulaması (Node.js + Express)

Minimal, dosya tabanlı (JSON) depolama kullanan bir rehber (kişiler) uygulaması. JWT ile kimlik doğrulama, admin onayı, kategorilere göre filtreleme ve basit bir web arayüzü içerir.

## Özellikler
- Kullanıcı kayıt/giriş (JWT)
- Admin onayı (kullanıcı onaylama/reddetme, rol değiştirme)
- Kişi ekleme/düzenleme/silme, arama ve kategoriye göre filtreleme
- Sağlık kontrolü (`/health`) ve statik frontend (Tailwind + vanilla JS)
- JSON dosyalarıyla kalıcı depolama (`data/` klasörü)

## Teknolojiler
- `Node.js`, `Express`, `cors`
- `jsonwebtoken` (JWT), `bcryptjs` (şifre hashleme)
- `express-validator` (girdi doğrulama)
- Frontend: `public/` (Tailwind CDN, basit JS)

## Hızlı Başlangıç
- Gereksinimler: Node.js 18+

1) Bağımlılıkları yükle
```
npm install
```

2) Geliştirme modunda başlat (hot-reload için `nodemon`)
```
npm run dev
```

3) Üretim benzeri başlatma
```
npm start
```

- Varsayılan port: `3000`
- Sağlık kontrolü: `http://localhost:3000/health`
- Frontend: `http://localhost:3000/`

## Ortam Değişkenleri
- `JWT_SECRET`: JWT imzalama anahtarı. Dev ortamında varsayılan bir değer kullanılır; prod’da mutlaka güçlü bir değer verin.

Windows PowerShell örneği:
```
$env:JWT_SECRET = "super-gizli-bir-anahtar"
npm start
```

## Komutlar
- `npm run dev`: Nodemon ile geliştirme sunucusu
- `npm start`: Node ile sunucu

## API Özeti
- Auth (`/api/auth`)
  - `POST /register` — Kayıt
  - `POST /login` — Giriş (JWT döner)
  - `GET /me` — Oturum açmış kullanıcının bilgileri
- Admin (`/api/admin`) — JWT + admin rolü gerekir
  - `GET /users`, `GET /users/pending`
  - `PUT /users/:id/approve`, `PUT /users/:id/reject`
  - `PUT /users/:id/role` (body: `{ role: "admin" | "user" }`)
- Contacts (`/api/contacts`) — JWT gerekir
  - `GET /` (opsiyonel `?category=`)
  - `GET /search?q=` (opsiyonel `&category=`)
  - `GET /categories/list`
  - `GET /:id`
  - `POST /` (body: `firstName,lastName,phone,category?`)
  - `PUT /:id`
  - `DELETE /:id`

Notlar:
- Telefon numarası TR formatına normalize edilir (örn. `0XXXXXXXXXX`).
- Kullanıcı başına basit bir depolama limiti (varsayılan 100 MB) takip edilir; kişi başı ~1KB varsayımıyla güncellenir.

## Proje Yapısı (kısa)
```
public/            # Statik frontend
src/
  server.js        # Express app, routerlar ve statik servis
  middleware/
    auth.js        # JWT üretme/doğrulama, admin koruması
  routes/
    auth.js        # Kayıt, giriş, me
    admin.js       # Admin onayı, rol işlemleri, tüm kişiler
    contacts.js    # Kişiler CRUD, arama, kategori
  db/
    usersStore.js      # Kullanıcılar JSON depolama
    contactsStore.js   # Kişiler JSON depolama
  utils/
    validators.js  # İsim/telefon doğrulayıcıları
data/
  users.json       # Uygulama çalışınca oluşur/güncellenir
  contacts.json    # Uygulama çalışınca oluşur/güncellenir
```

> Not: `data/database.sqlite` dosyası depoda bulunuyor ancak mevcut kod JSON dosyalarını kullanıyor; SQLite aktif kullanılmıyor.

## Güvenlik ve Üretim Uyarıları
- `JWT_SECRET` prod’da zorunlu ve güçlü olmalıdır.
- CORS şu an geniş; prod’da kısıtlayın.
- Rate limit, audit log vb. yok; ihtiyaca göre ekleyin.
- Dosya tabanlı depolama küçük projeler için uygundur; prod için veritabanı önerilir.

## Lisans
MIT


# 📱 Rehber Uygulaması - Proje Sunumu

> **Hazırlayan:** Mehmet Fatih Doğan  
> **Tarih:** 31 Ekim 2025  
> **Proje:** Kişi Yönetim Sistemi (Contact App)

---

## 🎯 Projenin Amacı

Bu proje, **kişisel rehber uygulaması** geliştirmek için hazırlandı. Kullanıcılar telefon rehberlerini web üzerinden yönetebilir, kişilerini kategorize edebilir ve güvenli bir şekilde saklayabilir. Her kullanıcı sadece kendi verilerine erişebilir ve admin onayı ile sisteme giriş yapabilir.

---

## 📚 Nedir Bu Proje?

Bir **web uygulaması** - yani tarayıcından açıp kullanabileceğin bir program. Telefonundaki rehber gibi ama web'de çalışıyor ve daha fazla özelliği var:

- 👤 **Üye olma ve giriş yapma** (kayıt/login)
- 📇 **Kişi ekleme, silme, düzenleme** (CRUD işlemleri)
- 🔍 **Kişi arama** (isim veya telefon ile)
- 📂 **Kategori oluşturma** (Aile, İş, Arkadaş gibi)
- 📤 **Dosyadan toplu kişi yükleme** (CSV, VCF, JSON)
- 🌙 **Karanlık mod** (dark mode)
- 👨‍💼 **Admin paneli** (kullanıcı yönetimi)

---

## 🏗️ Proje Nasıl Çalışıyor?

### 1. **Frontend (Ön Yüz) - Kullanıcının Gördüğü Kısım**
📁 `public/` klasörü

- **index.html**: Web sayfasının yapısı (HTML)
- **app.js**: Sayfanın davranışları (JavaScript)
- **styles.css**: Görünüm/tasarım (CSS)
- **Tailwind CSS**: Modern tasarım framework'ü (hazır stiller)

**Ne yapar?**
- Kullanıcıya güzel bir arayüz gösterir
- Butona tıklayınca backend'e istek gönderir
- Gelen verileri ekranda gösterir

### 2. **Backend (Arka Yüz) - Sunucu Tarafı**
📁 `src/` klasörü

- **server.js**: Ana sunucu dosyası (Express.js ile)
- **routes/**: API endpoint'leri (URL'ler ve işlemler)
  - `auth.js`: Giriş/kayıt işlemleri
  - `contacts.js`: Kişi işlemleri
  - `admin.js`: Admin işlemleri
- **db/**: Veri kaydetme/okuma işlemleri
  - `usersStore.js`: Kullanıcı veritabanı
  - `contactsStore.js`: Kişi veritabanı
- **middleware/**: Güvenlik kontrolleri
  - `auth.js`: Token kontrolü (giriş yapmış mı?)

**Ne yapar?**
- Frontend'den gelen istekleri dinler
- Veritabanına veri kaydeder/okur
- Güvenlik kontrolü yapar (şifre, token)
- Sonucu frontend'e geri gönderir

### 3. **Veritabanı - Verilerin Saklandığı Yer**
📁 `data/` klasörü

- **users.json**: Kullanıcı bilgileri (JSON dosyası)
- **contacts.json**: Kişi bilgileri (JSON dosyası)

**Neden JSON?**
- Basit ve anlaşılır
- Kurulum gerektirmiyor (MongoDB, MySQL gibi değil)
- Küçük projeler için ideal

---

## 🔧 Kullanılan Teknolojiler

### Backend (Sunucu Tarafı)
| Teknoloji | Ne İşe Yarar? |
|-----------|---------------|
| **Node.js** | JavaScript'i tarayıcı dışında çalıştırır (sunucu yapar) |
| **Express.js** | Web sunucusu framework'ü (route, middleware) |
| **bcryptjs** | Şifreleri güvenli hale getirir (hash'ler) |
| **jsonwebtoken** | Güvenli oturum yönetimi (JWT token üretir) |
| **express-validator** | Gelen verileri kontrol eder (validation) |
| **cors** | Farklı domainlerden erişime izin verir |

### Frontend (Kullanıcı Arayüzü)
| Teknoloji | Ne İşe Yarar? |
|-----------|---------------|
| **HTML** | Sayfanın yapısı (başlık, buton, input vs.) |
| **CSS** | Görsel tasarım (renk, boyut, konum) |
| **JavaScript (Vanilla)** | Sayfa davranışları (framework yok, saf JS) |
| **Tailwind CSS** | Hazır CSS sınıfları (hızlı tasarım) |
| **Bootstrap Icons** | İkon seti (📱, 🔍, ➕ gibi) |

---

## 📂 Dosya Yapısı (Basitleştirilmiş)

```
contact-app/
├── 📁 public/              # Frontend (kullanıcının gördüğü)
│   ├── index.html         # Ana sayfa
│   ├── app.js             # JavaScript kodu
│   ├── styles.css         # Stil dosyası
│   └── provinces.json     # İl-ilçe listesi
│
├── 📁 src/                # Backend (sunucu)
│   ├── 📁 db/             # Veritabanı işlemleri
│   │   ├── usersStore.js      # Kullanıcı CRUD
│   │   └── contactsStore.js   # Kişi CRUD
│   │
│   ├── 📁 routes/         # API endpoint'leri
│   │   ├── auth.js            # Login/Register
│   │   ├── contacts.js        # Kişi işlemleri
│   │   └── admin.js           # Admin işlemleri
│   │
│   ├── 📁 middleware/     # Güvenlik
│   │   └── auth.js            # Token kontrolü
│   │
│   └── server.js          # Ana sunucu dosyası
│
├── 📁 data/               # Veritabanı (JSON)
│   ├── users.json         # Kullanıcılar
│   └── contacts.json      # Kişiler
│
├── package.json           # Proje ayarları ve bağımlılıklar
└── README.md              # Proje açıklaması
```

---

## 🔄 Uygulama Akışı (Step by Step)

### 🔐 Kullanıcı Kaydı ve Giriş

```
1. Kullanıcı kayıt formunu doldurur
   ↓
2. Frontend → POST /api/auth/register → Backend
   ↓
3. Backend: Şifreyi hash'ler (bcryptjs)
   ↓
4. Backend: Kullanıcıyı users.json'a kaydeder (approved: false)
   ↓
5. Backend → "Kayıt başarılı! Admin onayı bekleniyor" → Frontend
   ↓
6. Admin, admin panelinden kullanıcıyı onaylar
   ↓
7. Kullanıcı giriş yapabilir (JWT token alır)
```

### 📇 Kişi Ekleme

```
1. Kullanıcı "+" butonuna tıklar
   ↓
2. Ad, Soyad, Telefon, Kategori girer
   ↓
3. Frontend → POST /api/contacts → Backend (Token ile)
   ↓
4. Backend: Token'ı kontrol eder (giriş yapmış mı?)
   ↓
5. Backend: Telefon numarasını doğrular
   ↓
6. Backend: contacts.json'a kaydeder (userId ile)
   ↓
7. Backend → Kişi bilgisi → Frontend
   ↓
8. Frontend: Listeyi günceller (ekranda gösterir)
```

### 🔍 Kişi Arama

```
1. Kullanıcı arama kutusuna "Ahmet" yazar
   ↓
2. Frontend → GET /api/contacts/search?q=Ahmet → Backend
   ↓
3. Backend: contacts.json'dan kullanıcıya ait kişileri okur
   ↓
4. Backend: İsim/soyad/telefonda "ahmet" geçenleri filtreler
   ↓
5. Backend → Sonuçlar → Frontend
   ↓
6. Frontend: Sonuçları ekranda gösterir
```

---

## 🔐 Güvenlik Nasıl Sağlanıyor?

### 1. **Şifre Güvenliği**
```javascript
// usersStore.js
const hashedPassword = await bcrypt.hash(password, 10);
// "123456" → "$2a$10$Abc123XyZ..." (geri dönüştürülemez)
```
- Şifreler **hash'lenmiş** olarak saklanır
- Kimse (admin bile) şifreyi göremez
- 10 round salt ile güçlendirilmiş

### 2. **JWT Token (Oturum Yönetimi)**
```javascript
// Login yapınca:
const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
// Token → Frontend'e gönderilir → LocalStorage'a kaydedilir

// Her istekte:
Authorization: Bearer <token>
// Backend token'ı kontrol eder, geçerli mi?
```

### 3. **Middleware (Koruma Katmanı)**
```javascript
// middleware/auth.js
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token yok' });
  
  const decoded = jwt.verify(token, SECRET_KEY);
  req.user = decoded; // Kullanıcı bilgisi
  next(); // İşleme devam
}

// routes/contacts.js
router.get('/', authenticate, async (req, res) => {
  // Buraya sadece giriş yapmış kullanıcılar ulaşabilir
});
```

### 4. **Veri İzolasyonu**
```javascript
// Her kullanıcı sadece kendi verilerini görür
const userContacts = await contactsStore.getAllByUserId(req.user.id);
```

### 5. **Input Validasyonu**
```javascript
// Frontend: Telefon doğrulama
if (!/^\d{10,11}$/.test(phone)) {
  alert('Geçersiz telefon numarası');
  return;
}

// Backend: express-validator
body('email').trim().isEmail().withMessage('Geçerli e-posta girin')
```

---

## 🎨 Özellikler (Detaylı)

### 1. **Kullanıcı Sistemi**
- ✅ Kayıt olma (register)
- ✅ Giriş yapma (login)
- ✅ Admin onay sistemi
- ✅ Rol tabanlı yetkilendirme (user/admin)
- ✅ Captcha koruması (matematik sorusu)

### 2. **Kişi Yönetimi (CRUD)**
| İşlem | HTTP Method | Endpoint | Açıklama |
|-------|------------|----------|----------|
| **Create** | POST | `/api/contacts` | Yeni kişi ekle |
| **Read** | GET | `/api/contacts` | Kişileri listele |
| **Update** | PUT | `/api/contacts/:id` | Kişi güncelle |
| **Delete** | DELETE | `/api/contacts/:id` | Kişi sil |

### 3. **Arama ve Filtreleme**
- 🔍 Anlık arama (isim/soyad/telefon)
- 📂 Kategoriye göre filtreleme
- 📋 Kategori listesi (kullanıcının kategorileri)

### 4. **Dosya Yükleme (Import)**
**Desteklenen Formatlar:**
- **CSV**: `Ad,Soyad,Telefon,Kategori`
- **VCF**: vCard format (mobil rehber)
- **JSON**: `[{"firstName":"...", "lastName":"...", ...}]`

**Akıllı Eşleştirme:**
```javascript
// Bu alan isimleri otomatik tanınır:
firstName → ["firstName", "first_name", "name", "ad", "isim"]
phone → ["phone", "telephone", "telefon", "tel", "mobile"]
```

### 5. **Admin Paneli**
- 📊 İstatistik kartları
  - Toplam kullanıcı
  - Bekleyen onaylar
  - Onaylı kullanıcılar
  - Toplam kişi sayısı
- 👥 Kullanıcı onaylama/reddetme
- 🔍 Kullanıcı arama ve listeleme
- 🎭 Rol değiştirme (user ↔ admin)

### 6. **Tema Sistemi**
```javascript
// 3 mod:
- Aydınlık (Light)
- Karanlık (Dark)
- Otomatik (saat 06:00-18:00 arasında aydınlık)

// LocalStorage'da saklanır:
localStorage.setItem('theme', 'dark');
```

---

## 💻 Kodlama Kavramları (Yeni Başlayanlar İçin)

### 1. **API (Application Programming Interface)**
Frontend ile backend arasındaki iletişim kuralları.

```javascript
// Frontend (JavaScript)
fetch('/api/contacts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ firstName: 'Ahmet', lastName: 'Yılmaz', phone: '05551234567' })
})

// Backend (Express.js)
router.post('/contacts', authenticate, async (req, res) => {
  const { firstName, lastName, phone } = req.body;
  // Kişiyi kaydet...
  res.json({ message: 'Kişi eklendi' });
});
```

### 2. **CRUD (Create, Read, Update, Delete)**
Veritabanı işlemlerinin 4 temel operasyonu.

```javascript
// Create (Oluştur)
await contactsStore.add({ firstName, lastName, phone, userId });

// Read (Oku)
await contactsStore.getAllByUserId(userId);

// Update (Güncelle)
await contactsStore.update(id, { firstName: 'Yeni Ad' }, userId);

// Delete (Sil)
await contactsStore.remove(id, userId);
```

### 3. **Async/Await (Asenkron Programlama)**
Zaman alan işlemleri beklemek için kullanılır.

```javascript
// ❌ Yanlış (sonuç beklenmiyor)
function getData() {
  const data = fs.readFile('data.json'); // Henüz okumadı
  return data; // undefined
}

// ✅ Doğru (sonuç bekleniyor)
async function getData() {
  const data = await fs.readFile('data.json'); // Okuması beklenir
  return data; // Veriler geldi
}
```

### 4. **Middleware (Ara Yazılım)**
İstek ve yanıt arasında çalışan fonksiyonlar.

```javascript
// Her istekte çalışır
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // Sonraki middleware'e geç
});

// Sadece /api/contacts için
router.use(authenticate); // Token kontrolü
```

### 5. **JWT (JSON Web Token)**
Güvenli oturum yönetimi için kullanılan token sistemi.

```
Header.Payload.Signature
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImVtYWlsIjoiYWhAdGVzdC5jb20ifQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

**Nasıl çalışır?**
1. Login yapınca backend token üretir
2. Frontend token'ı LocalStorage'a kaydeder
3. Her istekte token gönderilir: `Authorization: Bearer <token>`
4. Backend token'ı doğrular, kullanıcıyı tanır

---

## 🚀 Projeyi Çalıştırma (Adım Adım)

### 1. **Node.js Kurulumu**
- [nodejs.org](https://nodejs.org) adresinden indir
- Kurulum sonrası test et:
```bash
node --version  # v14.x.x veya üzeri
npm --version   # 6.x.x veya üzeri
```

### 2. **Projeyi İndir**
```bash
# Git ile
git clone <repo-url>
cd contact-app

# Veya ZIP indir ve aç
```

### 3. **Bağımlılıkları Yükle**
```bash
npm install
# package.json'daki tüm kütüphaneler yüklenir
```

### 4. **Admin Kullanıcısı Oluştur**
```bash
node -e "
const usersStore = require('./src/db/usersStore');
(async () => {
  const admin = await usersStore.create({
    fullName: 'Admin',
    phone: '05551234567',
    email: 'admin@rehber.com',
    password: 'admin123',
    age: 30,
    province: 'İstanbul',
    district: 'Kadıköy',
    gender: 'Erkek'
  });
  await usersStore.setRole(admin.id, 'admin');
  await usersStore.updateApprovalStatus(admin.id, true);
  console.log('Admin oluşturuldu!');
})();
"
```

### 5. **Sunucuyu Başlat**
```bash
npm start
# Server running on http://localhost:3000
```

### 6. **Tarayıcıda Aç**
```
http://localhost:3000
```

**Giriş Bilgileri:**
- E-posta: `admin@rehber.com`
- Şifre: `admin123`

---

## 🧪 Test Senaryoları

### Senaryo 1: Yeni Kullanıcı Kaydı
1. Ana sayfada "Kayıt Ol" tıkla
2. Formu doldur:
   - Ad Soyad: Ayşe Kaya
   - Telefon: 05559876543
   - E-posta: ayse@test.com
   - Şifre: 123456
   - Yaş: 25
   - İl: Ankara
   - İlçe: Çankaya
   - Cinsiyet: Kadın
3. Captcha sorusunu çöz (örn: 5 + 3 = 8)
4. "Kayıt Ol" tıkla
5. "Hesabınız onay bekliyor" mesajını gör
6. Admin panelinden onayla
7. Giriş yap

### Senaryo 2: Kişi Ekleme
1. Giriş yap
2. Sağ alttaki "+" butonuna tıkla
3. Bilgileri gir:
   - Ad: Mehmet
   - Soyad: Demir
   - Telefon: 05441112233
   - Kategori: Arkadaş
4. "Kaydet" tıkla
5. Kişinin listede göründüğünü kontrol et

### Senaryo 3: Dosyadan Kişi Yükleme
1. `contacts.csv` oluştur:
```csv
firstName,lastName,phone,category
Ali,Yılmaz,05331234567,Aile
Fatma,Şahin,05421234567,İş
```
2. Upload butonuna tıkla
3. Dosyayı seç ve yükle
4. 2 kişinin eklendiğini gör

---

## 📊 Veritabanı Yapısı

### users.json
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "fullName": "Ahmet Yılmaz",
    "phone": "05551234567",
    "email": "ahmet@test.com",
    "password": "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    "age": 28,
    "province": "İstanbul",
    "district": "Kadıköy",
    "gender": "Erkek",
    "role": "user",
    "approved": true,
    "storageLimit": 104857600,
    "storageUsed": 0,
    "createdAt": "2025-10-31T00:00:00.000Z",
    "updatedAt": "2025-10-31T00:00:00.000Z"
  }
]
```

### contacts.json
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440000",
    "firstName": "Ayşe",
    "lastName": "Kaya",
    "phone": "05559876543",
    "userId": "550e8400-e29b-41d4-a716-446655440000",
    "category": "Aile",
    "createdAt": "2025-10-31T00:00:00.000Z",
    "updatedAt": "2025-10-31T00:00:00.000Z"
  }
]
```

---

## 🔍 Öğrenme Kaynakları

### JavaScript Temelleri
- [MDN Web Docs](https://developer.mozilla.org/tr/docs/Web/JavaScript)
- [JavaScript.info](https://javascript.info/)

### Node.js & Express.js
- [Node.js Docs](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/tr/)

### Frontend
- [HTML & CSS](https://developer.mozilla.org/tr/docs/Web/HTML)
- [Tailwind CSS](https://tailwindcss.com/docs)

### Güvenlik
- [OWASP](https://owasp.org/)
- [JWT.io](https://jwt.io/)

---

## 🎓 Bu Projeden Neler Öğrenebilirsin?

### 1. **Backend Geliştirme**
- Node.js ve Express.js kullanımı
- REST API tasarımı
- Dosya tabanlı veritabanı
- Async/Await kullanımı

### 2. **Frontend Geliştirme**
- Vanilla JavaScript (framework yok)
- DOM manipülasyonu
- Fetch API (AJAX)
- Responsive tasarım (Tailwind CSS)

### 3. **Güvenlik**
- Şifre hash'leme (bcryptjs)
- JWT token sistemi
- Middleware kullanımı
- Input validasyonu

### 4. **Mimari**
- MVC benzeri yapı (Model-View-Controller)
- Katmanlı mimari (routes → db → data)
- Middleware pattern
- RESTful API prensipleri

### 5. **Dosya İşlemleri**
- JSON okuma/yazma
- CSV parsing
- VCF parsing
- Dosya upload

---

## 💡 Geliştirme Fikirleri

Projeyi geliştirmek için yapabileceklerin:

### Kolay Seviye
- [ ] Profil fotoğrafı ekleme
- [ ] Kişi notları (note alanı)
- [ ] Favoriler sistemi (★)
- [ ] Kişi sayısını gösterme
- [ ] Daha fazla tema rengi

### Orta Seviye
- [ ] Gerçek veritabanı (MongoDB, PostgreSQL)
- [ ] Şifre sıfırlama (e-posta ile)
- [ ] Kişi export (CSV/VCF indirme)
- [ ] Profil düzenleme
- [ ] Çoklu kategori (bir kişi birden fazla kategoride)

### Zor Seviye
- [ ] İki faktörlü kimlik doğrulama (2FA)
- [ ] Gerçek depolama limiti (dosya boyutu hesaplama)
- [ ] Bulut depolama (AWS S3, Cloudinary)
- [ ] E-posta bildirimleri (NodeMailer)
- [ ] Aktivite log sistemi (kim ne yaptı?)
- [ ] Socket.io ile gerçek zamanlı güncellemeler

---

## ❓ Sık Sorulan Sorular

### 1. **Node.js nedir, neden kullanıyoruz?**
Node.js, JavaScript'i tarayıcı dışında (sunucuda) çalıştırmayı sağlar. Böylece frontend ve backend'i aynı dille yazabilirsin.

### 2. **Express.js nedir?**
Express.js, Node.js için web sunucusu framework'ü. Route tanımlama, middleware kullanma gibi işlemleri kolaylaştırır.

### 3. **JWT token nedir, cookie'den farkı ne?**
JWT, kullanıcı bilgilerini içeren şifrelenmiş bir token. Cookie sunucuda saklanır, JWT client'ta (LocalStorage). JWT stateless (sunucu bilgi tutmaz).

### 4. **Neden gerçek veritabanı kullanmıyoruz?**
Öğrenme amaçlı proje olduğu için basit tutuldu. JSON dosyası, MongoDB/PostgreSQL kurulumu gerektirmez.

### 5. **Async/Await neden kullanılıyor?**
Dosya okuma/yazma gibi zaman alan işlemleri senkron yaparsak uygulama donabilir. Async/Await ile işlem bitmeden başka şeyler yapabiliyoruz.

### 6. **Middleware nedir?**
İstek ve yanıt arasında çalışan fonksiyonlar. Örneğin: her istekte token kontrolü yapan bir middleware.

### 7. **CRUD ne demek?**
Create (Oluştur), Read (Oku), Update (Güncelle), Delete (Sil) - veritabanı işlemlerinin 4 temeli.

---

## 🏆 Sonuç

Bu proje, **full-stack web geliştirme** için mükemmel bir başlangıç. Backend, frontend, güvenlik, veritabanı gibi birçok konuyu öğrenebilirsin. Kod temiz ve anlaşılır yazılmış, yeni başlayanlar için ideal.

**Ne öğrendik?**
- ✅ Node.js ve Express.js
- ✅ REST API tasarımı
- ✅ JWT authentication
- ✅ CRUD işlemleri
- ✅ Dosya işlemleri
- ✅ Frontend-Backend iletişimi
- ✅ Güvenlik best practices

**Sıradaki Adımlar:**
1. Projeyi çalıştır ve keşfet
2. Kodu satır satır oku ve anlamaya çalış
3. Küçük değişiklikler yap (renk, metin değiştir)
4. Yeni özellikler ekle (yukarıdaki fikirlerden seç)
5. Kendi projeni geliştir!

---

**İyi kodlamalar! 🚀**

*Bu sunum, yazılım öğrenmeye yeni başlayanlar için hazırlanmıştır. Sorularınız için GitHub Issues kullanabilirsiniz.*

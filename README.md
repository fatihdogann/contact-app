# 📱 Rehber Uygulaması

Modern, güvenli ve kullanıcı dostu kişi yönetim sistemi.

## ✨ Özellikler

### 🔐 Kimlik Doğrulama ve Güvenlik
- **Üyelik Sistemi**: Kayıt ve giriş işlemleri
- **JWT Token**: Güvenli oturum yönetimi
- **Admin Onay Sistemi**: Yeni kullanıcılar admin onayı ile aktif olur
- **Şifre Güvenliği**: bcrypt ile hash'lenmiş şifreler
- **Captcha Koruması**: Kayıt formunda matematik tabanlı bot koruması
- **Rol Tabanlı Yetkilendirme**: Admin ve kullanıcı rolleri

### 👥 Kullanıcı Yönetimi
- **Detaylı Profil**: Ad Soyad, Telefon, E-posta, Yaş, İl-İlçe, Cinsiyet
- **Dinamik İl-İlçe Seçimi**: Türkiye'nin tüm il ve ilçeleri
- **Kullanıcı Bazlı Veri**: Her kullanıcı sadece kendi verilerini görür

### 📇 Kişi Yönetimi
- **CRUD İşlemleri**: Kişi ekleme, düzenleme, silme, listeleme
- **Akıllı Arama**: Ad, soyad veya telefon ile anlık arama
- **Kategori Sistemi**: Kişileri kategorilere ayırma (Aile, Arkadaş, İş, vb.)
- **Kategori Filtreleme**: Kategoriye göre listeleme
- **Telefon Doğrulama**: Türkiye telefon numarası formatı kontrolü
- **Kart Tabanlı Görünüm**: Modern ve kullanıcı dostu arayüz

### 📤 Dosya Yükleme
- **CSV Desteği**: Virgülle ayrılmış değerler
- **VCF Desteği**: vCard formatı (mobil rehber)
- **JSON Desteği**: JSON array veya object
- **Akıllı Alan Eşleştirme**: Farklı alan isimleri otomatik tanınır
- **Toplu İçe Aktarma**: Birden fazla kişiyi tek seferde yükleme
- **İlerleme Göstergesi**: Yükleme durumu canlı takip

### 🎨 Tema Sistemi
- **3 Mod**: Aydınlık, Karanlık, Otomatik
- **Otomatik Geçiş**: Saat 06:00-18:00 arası aydınlık, diğer saatlerde karanlık
- **Kullanıcı Tercihi**: Tercih localStorage'da kaydedilir
- **Toast Bildirimleri**: Tema değişikliği bildirimleri

### 👨‍💼 Admin Paneli
- **İstatistik Kartları**: 
  - Toplam kullanıcı sayısı
  - Onay bekleyen kullanıcılar
  - Onaylı kullanıcılar
  - Toplam kişi sayısı
- **Kullanıcı Onaylama**: Bekleyen kullanıcıları onaylama/reddetme
- **Kullanıcı Listesi**: Tüm kullanıcıları görüntüleme ve arama
- **Depolama İzleme**: Kullanıcı bazında depolama durumu (yakında)
- **Detaylı Bilgiler**: Kullanıcı profil ve istatistikleri

### 🎯 Modern Arayüz
- **Responsive Tasarım**: Mobil, tablet ve masaüstü uyumlu
- **Tailwind CSS**: Modern ve hızlı stil sistemi
- **Dark Mode**: Tam dark mode desteği
- **Smooth Animations**: Akıcı geçişler ve hover efektleri
- **Icon Pack**: Bootstrap Icons ile zengin ikon seti

## 🚀 Kurulum

### Gereksinimler
- Node.js (v14 veya üzeri)
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın:**
```bash
git clone <repo-url>
cd contact-app
```

2. **Bağımlılıkları yükleyin:**
```bash
npm install
```

3. **Admin kullanıcısı oluşturun:**
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
  console.log('Admin oluşturuldu: admin@rehber.com / admin123');
})();
"
```

4. **Uygulamayı başlatın:**
```bash
npm start
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## 📖 Kullanım

### İlk Giriş
1. Uygulamayı açın
2. Admin bilgileri ile giriş yapın:
   - **E-posta**: admin@rehber.com
   - **Şifre**: admin123

### Yeni Kullanıcı Kayıt
1. "Kayıt Ol" butonuna tıklayın
2. Formu doldurun
3. Güvenlik sorusunu cevaplayın
4. Admin onayını bekleyin

### Kişi Ekleme
1. Sağ taraftaki "+" butonuna tıklayın
2. Ad, soyad, telefon bilgilerini girin
3. İsteğe bağlı kategori seçin
4. "Kaydet" butonuna tıklayın

### Dosya Yükleme
1. Sağ taraftaki "Upload" butonuna tıklayın
2. CSV, VCF veya JSON dosyası seçin
3. "Yükle" butonuna tıklayın
4. İlerlemeyi takip edin

### Tema Değiştirme
- Üst bardaki ay/güneş ikonuna tıklayın
- Her tıklamada: Aydınlık → Karanlık → Otomatik

### Admin İşlemleri
1. Üst bardaki "Admin" butonuna tıklayın
2. İstatistikleri görüntüleyin
3. Bekleyen kullanıcıları onaylayın
4. Kullanıcıları arayın ve yönetin

## 🗂️ Proje Yapısı

```
contact-app/
├── public/              # Frontend dosyaları
│   ├── index.html      # Ana HTML (Tailwind CSS)
│   ├── app.js          # JavaScript (Vanilla JS)
│   ├── styles.css      # Ek CSS (legacy)
│   └── provinces.json  # İl-ilçe verileri
├── src/
│   ├── db/             # Veri katmanı
│   │   ├── contactsStore.js  # Kişi CRUD
│   │   └── usersStore.js     # Kullanıcı CRUD
│   ├── middleware/     # Express middleware
│   │   └── auth.js     # JWT doğrulama
│   ├── routes/         # API rotaları
│   │   ├── contacts.js # Kişi API'leri
│   │   ├── auth.js     # Login/Register
│   │   └── admin.js    # Admin API'leri
│   ├── utils/          # Yardımcı fonksiyonlar
│   │   └── validators.js  # Doğrulama
│   └── server.js       # Express sunucu
├── data/               # JSON veritabanı
│   ├── contacts.json   # Kişiler
│   └── users.json      # Kullanıcılar
└── package.json
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Yeni kullanıcı kaydı
- `POST /api/auth/login` - Giriş yapma
- `GET /api/auth/me` - Oturum kontrolü

### Contacts (Authenticated)
- `GET /api/contacts` - Kişileri listele
- `GET /api/contacts/search?q=` - Kişi ara
- `GET /api/contacts/categories/list` - Kategorileri listele
- `GET /api/contacts/:id` - Kişi detayı
- `POST /api/contacts` - Yeni kişi
- `PUT /api/contacts/:id` - Kişi güncelle
- `DELETE /api/contacts/:id` - Kişi sil

### Admin (Admin Only)
- `GET /api/admin/users` - Tüm kullanıcılar
- `GET /api/admin/users/pending` - Onay bekleyenler
- `GET /api/admin/contacts` - Tüm kişiler
- `PUT /api/admin/users/:id/approve` - Kullanıcı onayla
- `PUT /api/admin/users/:id/reject` - Kullanıcı reddet
- `PUT /api/admin/users/:id/role` - Rol değiştir

## 🛡️ Güvenlik

- ✅ Şifreler bcrypt ile hash'lenir (10 round)
- ✅ JWT token ile oturum yönetimi
- ✅ API endpoint'leri auth middleware ile korunur
- ✅ Admin işlemleri rol kontrolü ile kısıtlanır
- ✅ Captcha ile bot koruması
- ✅ Input validasyonları (frontend + backend)
- ✅ SQL Injection koruması (NoSQL kullanımı)
- ✅ XSS koruması (HTML escaping)

## 🎯 Validasyonlar

### Telefon Numarası
- Sadece rakam kabul edilir
- Türkiye formatı: `05xx xxx xx xx`
- Otomatik normalizasyon: `+90`, `0`, 10 haneli formatlar kabul edilir
- Mobil: 05xx, 04xx formatları
- Sabit: 02xx, 03xx formatları

### Ad ve Soyad
- Sadece harf içerebilir
- Türkçe karakterler desteklenir (ç, ğ, ı, ö, ş, ü)
- Rakam içeremez

### E-posta
- Standart e-posta format kontrolü
- Benzersiz olmalı (sistem genelinde)

### Şifre
- Minimum 6 karakter
- Hash'lenerek saklanır

## 📱 Desteklenen Dosya Formatları

### CSV (Comma-Separated Values)
```csv
firstName,lastName,phone,category
Ahmet,Yılmaz,05551234567,Aile
Ayşe,Kaya,05559876543,İş
```

### VCF (vCard)
```vcard
BEGIN:VCARD
VERSION:3.0
FN:Ahmet Yılmaz
N:Yılmaz;Ahmet;;;
TEL:05551234567
CATEGORIES:Aile
END:VCARD
```

### JSON
```json
[
  {
    "firstName": "Ahmet",
    "lastName": "Yılmaz",
    "phone": "05551234567",
    "category": "Aile"
  }
]
```

## 🔮 Gelecek Özellikler

- [ ] Gerçek depolama limiti sistemi (100 MB/kullanıcı)
- [ ] Kişi fotoğrafı yükleme
- [ ] Kişi notları
- [ ] Favoriler sistemi
- [ ] Çoklu kategori desteği
- [ ] Export (CSV/VCF) özelliği
- [ ] E-posta ile bildirimler
- [ ] İki faktörlü kimlik doğrulama (2FA)
- [ ] Kullanıcı profil düzenleme
- [ ] Aktivite log sistemi

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License - detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 👨‍💻 Geliştirici

**Mehmet Fatih Doğan**

---

## 🐛 Bilinen Sorunlar

Şu an bilinen kritik sorun bulunmamaktadır.

## 💡 İpuçları

- **Toplu kişi ekleme** için dosya yükleme özelliğini kullanın
- **Dark mode** otomatik mod ile gece-gündüz otomatik değişir
- **Kategori** alanı serbest metin, istediğiniz kategoriyi yazabilirsiniz
- **Admin onayı** beklerken giriş yapamazsınız
- **Telefon** sadece rakam, sistem otomatik format atar

## 📞 Destek

Sorun bildirmek için GitHub Issues kullanın.

---

**⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!**

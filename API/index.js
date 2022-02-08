const express = require('express');
const app = express();

const port = process.env.PORT || 9000;

app.use((req, res, next) => { 
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
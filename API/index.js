const express = require('express');
const dbConnection = require('./src/dbConnection');

const app = express();


const port = process.env.PORT || 9000;

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/user", async (req, res) => {
    let apiKey = req.query.key;
    let keyValid = await dbConnection.validateAPIKey(apiKey);
    let userId = req.query.id;
    let user;
    if (keyValid) {
        user = await dbConnection.getUserById(userId);

    } else {
        res.status(401).send("Invalid API key");
    }
    if(user) {
        res.send(user[0]);
    } else {
        res.status(404).send("User not found");
    }
});

app.get("*", (req, res) => {
    res.status(404).send("Not found");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

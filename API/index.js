const express = require('express');
const dbConnection = require('./src/dbConnection');
const bcrypt = require('bcrypt');

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

app.get("/api/createUser", async (req, res) => {
    let apiKey = req.query.key;
    let email = req.query.email;
    let password = req.query.password;
    let firstName = req.query.firstname;
    let lastName = req.query.lastname;
    let nickname = req.query.nickname;
    let role = req.query.role;
    let companyId = req.query.companyid;

    let keyValid = await dbConnection.validateAPIKey(apiKey);

    if (keyValid) {
        let passHash = await bcrypt.hash(password, 12);
        try {
            let user = await dbConnection.createUser(email, passHash, firstName, lastName, nickname, role, companyId);
            res.send(user);
        } catch (e) {
            res.status(500).send("Error creating user");
        }
        // handle error

    } else {
        res.status(401).send("Invalid API key");
    }
});

app.get("*", (req, res) => {
    res.status(404).send("Not found");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

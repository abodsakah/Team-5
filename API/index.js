const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv').config({'path': __dirname + '/../.env'});
const auth0 = require('auth0-js');

const app = express();

var auth = new auth0.WebAuth({
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
});

const port = process.env.PORT || 9000;

app.use((req, res, next) => { 
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.get("/", (req, res) => {
    auth.login({
        username: "abodsakka2001@gmail.com",
        password: "Nhy99011963",
    })
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
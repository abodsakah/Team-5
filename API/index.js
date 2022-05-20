'use strict'
const express = require('express');
const fileupload = require('express-fileupload');
const path = require('path'); // for file uploads
const mainRoute = require('./routes/main')

const app = express();
const mainApp = express();


const port = process.env.PORT || 9000;


app.use(fileupload({
    useTempFiles: true,
    tempFileDir: './tempFiles'
}));

app.use('/api/v1', mainRoute);

app.use("/api/v1/static", express.static(path.join(__dirname, 'public'))); // listen for the /static/api url to get static files
app.use(express.static(path.join(__dirname, 'public'))); // fallback



app.use((req, res, next) => {
    //set the request's mode to 'no-cors'
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    console.log(`${req.method} request for '${req.url}'`);
    next();
});


app.get("*", (req, res) => {
    res.status(404).send("Not found");
});

const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// gracefully shutdown

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);

let connections = [];
server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => {
        connections = connections.filter(curr => curr !== connection);
    });
});

/**
 * Shut down server by closing all connections
 */
function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    // force close connections
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);

    // force close connections after 10 seconds
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 30000);
    
    // close all connections
    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}

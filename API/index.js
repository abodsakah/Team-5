'use strict'
const express = require('express');
const dbConnection = require('./src/dbConnection'); // gets information from the database
const gatewayMqtt = require('./src/gatewayMqttConnect'); //
const neoNodeMsgSender = require('./src/neoNodeMsgSender'); // Sends messages to the gateway
const neoNodeMsgParser = require('./src/neoNodeMsgParser'); // Parses messages from the gateway
const bcrypt = require('bcrypt'); // for hashing passwords
const fileupload = require('express-fileupload');
const path = require('path'); // for file uploads


const app = express();

const port = process.env.PORT || 9000;


app.use(fileupload({
    useTempFiles: true,
    tempFileDir: './tempFiles'
}));

app.use("/api/v1/static", express.static(path.join(__dirname, 'public'))); // listen for the /static/api url to get static files
app.use(express.static(path.join(__dirname, 'public'))); // fallback


app.use((req, res, next) => {
    //set the request's mode to 'no-cors'
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.get("/api/v1/user", async (req, res) => {
    try{
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
            res.status(200).send(user[0]);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/createUser", async (req, res) => {
    try{
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

        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/createCompany", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let name = req.query.name;
        let phone = req.query.phone;
        let email = req.query.email;
        let adminMail = req.query.adminmail;
        let adminFirstName = req.query.adminfirstname;
        let adminLastName = req.query.adminlastname;
        let adminNickname = req.query.adminusername;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            try {
                let company = await dbConnection.createCompany(name,email, phone);
                let companyJson = {
                    companyId: company[0]
                }

                let companyId = company[0].id;
                // generate random password
                let password = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
                let passHash = await bcrypt.hash(password, 12);
                let user = await dbConnection.createUser(adminMail, passHash, adminFirstName, adminLastName, adminNickname, 1, companyId);
                // send success message
                let status = {
                    status: "success",
                    message: "Company created",
                    email: adminMail,
                    password: password,
                    companyId: company[0].id
                }
                res.status(200).send(JSON.stringify(status));
            } catch (e) {
                console.log(e);
                res.status(500).send("Error creating company");
            }

        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getCompnies", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            try {
                let companies = await dbConnection.getCompanies();
                res.status(200).send(companies);
            } catch (e) {
                res.status(500).send("Error getting companies");
            }

        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getCompanyLog", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let companyId = req.query.companyid;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            let company = await dbConnection.getCompanyLog(companyId);
            res.status(200).send(company);
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getCompany", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let companyId = req.query.companyid;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            let company = await dbConnection.getCompany(companyId);
            res.status(200).send(company);
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/v1/updateCompany", async (req, res) => { 
    try{
        let apiKey = req.body.key;
        let name = req.body.name;
        let phone = req.body.phone;
        let email = req.body.email;
        let color = req.body.color;
        let companyId = req.body.companyid;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            try {

                let oldInfo = await dbConnection.getCompany(companyId);

                console.log(oldInfo);
                let logo = {
                    name: "",
                };
        
                let logoName = "";
        
                let path;
                if (req.files) { // if there is a file we will set the path
                    logo = req.files.logo;
                    logoName = logo.name;
                    path = __dirname + "/public/uploads/logo/" + logo.name;
                }
        
                if(logo.name != '') { // if there is a file and the logo is not empty then we move it to our path
                    logo.mv(path, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send("Error uploading file");
                        }
                    });
                }
        
                if (color == "" || color == null) { // if the color is empty we will use the default styling
                    color = oldInfo.color;
                }
                if (logo == undefined || logo.name == undefined || logo.name == "") { // if the logo is empty we will use the default styling
                    logoName = oldInfo.logo;
                }
        
                try {
                    await dbConnection.updateCompanyInfo(companyId, name, email, phone, color, logoName);
                    
                    res.status(200).send({
                        status: "success",
                        message: "Company updated"
                    });
                } catch (e) {
                    console.log(e);
                    res.status(500).send("Error getting company");
                }
            } catch (e) {
                console.log(e);
                res.status(500).send("Error creating company");
            }

        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getNodes", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            let nodes = await dbConnection.getPreloadedNodes();
            res.status(200).send(nodes);
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/addNode", async (req, res) => { 
    try{
        let apiKey = req.query.key;
        let deviceId = req.query.deviceid;
        let deviceType = req.query.devicetype;
        let companyId = req.query.companyid;

        let keyValid = await dbConnection.validateAPIKey(apiKey);
        
        if (keyValid) {
            try {
                let device = await dbConnection.addPreloadedNode(deviceId, deviceType, companyId);
                res.status(200).send(device);
            } catch (e) {
                console.log(e);
                res.status(500).send("Error creating device");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get("/api/v1/nodes/neighborreq", async (req, res) => {
    try{
        let companyId = req.query.companyId;
        let data = await  neoNodeMsgSender.sendNeighborListRequest(companyId);
        let nodes = await neoNodeMsgParser.getNodes();
        console.log(await neoNodeMsgParser.nodes);
        res.send(await neoNodeMsgParser.nodes);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/nodes/nodeinfo", async (req, res) => {
    try{
        let companyId = req.query.companyId;
        let nodeId = req.query.nodeId;

        let data = await neoNodeMsgSender.sendNodeInfoRequest(companyId, nodeId);
        let nodeInfo = await neoNodeMsgParser.getNodesInfo();
        res.send(nodeInfo);
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/api/v1/getCompanySettings", async (req, res) => {
    try{
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        if (keyValid) {
            try {
                let companyId = req.body.id;
                let company = await dbConnection.getCompanySetting(companyId);
                res.status(200).send(company[0][0]);
            } catch (e) {
                res.status(500).send("Error getting company");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/v1/updateThreshold", async (req, res) => {
    try{
        let apiKey = req.body.key;
        let nodeId = req.body.id;
        let action = req.body.action;
        let value = req.body.value;
        let companyId = req.body.companyid;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            try {
                await dbConnection.updateThreshold(nodeId, action, value, companyId);
                res.status(200).send({status: "success", message: "Threshold updated"});
            } catch (e) {
                console.log(e);
                res.status(500).send({status: "error", message: "Error updating threshold"});
            }
        } else {
            res.status(401).send({status: "error", message: "Invalid API key"});
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/v1/addStyling", async (req, res) => {
    try{
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            let companyId = req.body.id;
            let color = req.body.color;
            let logo = {
                name: "",
            };

            let logoName = "";

            let path;
            if (req.files) { // if there is a file we will set the path
                logo = req.files.logo;
                logoName = logo.name;
                path = __dirname + "/public/uploads/logo/" + logo.name;
            }

            if(logo.name != '') { // if there is a file and the logo is not empty then we move it to our path
                logo.mv(path, function (err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send("Error uploading file");
                    }
                });
            }

            try {
                let company = await dbConnection.addStyling(companyId, color, logoName);
                res.status(200).send({
                    status: "success",
                    message: "Company updated"
                });
            } catch (e) {
                console.log(e);
                res.status(500).send("Error getting company");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getNodeType", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.query.nodeId;
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let node = await dbConnection.getNodeType(nodeId, companyId);
                res.status(200).send(node);
            } catch (e) {
                res.status(500).send("Error getting sensor");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getNodeInfo", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.query.nodeId;
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let node = await dbConnection.getNodeInfo(nodeId,companyId);
                res.status(200).send(node);
            } catch (e) {
                res.status(500).send("Error getting sensor");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getThreshold", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let nodeId = req.query.id;
        let companyId = req.query.companyId;
        let keyValid = await dbConnection.validateAPIKey(apiKey);

        if (keyValid) {
            try {
                let threshold = await dbConnection.getThresholdForNode(nodeId, companyId);
                let node = await dbConnection.getNodeInfo(nodeId, companyId);
                console.log(threshold);
                res.status(200).send({
                    threshold: threshold,
                    device: node
                });
            } catch (e) {
                res.status(500).send({status: "error", message: "Error getting threshold"});
            }
        } else {
            res.status(401).send({status: "error", message: "Invalid API key"});
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getNodeStatus", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.query.nodeId;
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let node = await dbConnection.getNodeStatus(nodeId,companyId);
                res.status(200).send(node);
            } catch (e) {
                res.status(500).send("Error getting sensor");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/api/v1/forceWesMode", async (req, res) => {
    try{
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.query.nodeId;
        let companyId = req.query.companyId;
        if (keyValid) {
            try {
                await neoNodeMsgSender.sendForceWesMode(nodeId,companyId);
                res.status(200).send({
                    status: "success",
                });
                console.log("sendForceWesMode success!");
            } catch (e) {
                res.status(500).send(e);
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/api/v1/deleteNode", async (req, res) => {
    try {
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.body.nodeId;
        let companyId = req.body.companyId;

        if (keyValid) {
            try {
                await neoNodeMsgSender.deleteNode(nodeId,companyId);
                res.status(200).send({
                    status: "success",
                });
            } catch (e) {
                res.status(500).send(e);
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.post("/api/v1/setNodeDeleted", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let nodeId = req.query.nodeId;
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let node = await dbConnection.setNodeASDeleted(nodeId, companyId);
                res.status(200).send({
                    status: "success",
                });
            } catch (e) {
                res.status(500).send(e);
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getUsersForCompany", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.query.companyId;
        if (keyValid) {
            try {
                let users = await dbConnection.getUsersForCompany(companyId);
                res.status(200).send(users);
            } catch (e) {
                res.status(500).send("Error getting users");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.get("/api/v1/getReportedLogicalDeviceForCompany", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let devices = await dbConnection.getReportedLogicalDeviceForCompany(companyId);
                res.status(200).send(devices);
            } catch (e) {
                res.status(500).send("Error getting devices");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getLogicalDeviceForCompany", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.query.companyId;

        if (keyValid) {
            try {
                let devices = await dbConnection.getLogicalDeviceForCompany(companyId);
                res.status(200).send(devices);
            } catch (e) {
                res.status(500).send("Error getting devices");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getLogicalDeviceTypeAmount", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.query.companyId;
        let type = req.query.type;

        if (keyValid) {
            try {
                let devices = await dbConnection.getAmountOfSensorTypes(`${type}`, companyId);
                res.status(200).send(devices);
            } catch (e) {
                res.status(500).send("Error getting devices");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/getBuildings", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.query.companyId;
        if (keyValid) {
            try {
                let spaces = await dbConnection.getBuildingsForCompany(companyId);
                res.status(200).send(spaces);
            } catch (e) {
                res.status(500).send("Error getting spaces");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getSpaces", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let parentSpaceId = req.query.parentId;

        if (keyValid) {
            try {
                let spaces = await dbConnection.getSpacesForBuilding(parentSpaceId);
                res.status(200).send(spaces);
            } catch (e) {
                res.status(500).send("Error getting spaces");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.get("/api/v1/getAssetsForSpace", async (req, res) => {
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let spaceId = req.query.spaceId;

        if (keyValid) {
            try {
                let assets = await dbConnection.getAssetsInSpace(spaceId);
                res.status(200).send(assets);
            } catch (e) {
                console.log(e);
                res.status(500).send("Error getting assets");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post("/api/v1/addLogicalDevice", async (req, res) => {
    try {
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let companyId = req.body.companyId;
        let deviceUid = req.body.deviceUid;
        let deviceName = req.body.deviceName;
        let is_part_of = req.body.is_part_of;
        let node = await dbConnection.getPreloadedNode(deviceUid, companyId);
        node = node[0][0]

        if (keyValid) {
            if (node) {
                try {
                    let device = await dbConnection.addLogicalDevice(deviceUid, deviceName, is_part_of, node.type, "SETUP", companyId);
                    res.status(200).send(node);
                } catch (e) {
                    // TODO: getting error when adding device
                    console.log(e);
                    res.status(500).send("Error adding device");
                }
            } else {
                res.status(500).send("Device not found");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        console.log(err.message)
        res.status(500).send(err.message);
    }
});

app.post("/api/v1/updateSensorThreshold", async (req, res) => {
    try {
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let deviceUid = req.body.deviceUid;
        let threshold = req.body.threshold;
        let thresholdAction = req.body.thresholdAction;
        if (keyValid) {
            try {
                let thresholdId = await dbConnection.createThreshold(thresholdAction, threshold);
                await dbConnection.updateLogicalDeviceWithThreshold(deviceUid, thresholdId.id);
                res.status(200).send({"status": "Success"});
            } catch (e) {
                console.log(e.message);
                res.status(500).send("Error updating device");
            }
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/v1/getNodesOfType', async (req, res) => {
    try {
    let apiKey = req.body.key;
    let keyValid = await dbConnection.validateAPIKey(apiKey);
    let companyId = req.body.companyId;
    let type = req.body.type;
    if (keyValid) {
        try {
            let nodes = await dbConnection.getNodesOfType(type, companyId);
            res.status(200).send(nodes);
        } catch (e) {
            res.status(500).send("Error getting nodes");
        }
    } else {
        res.status(401).send("Invalid API key");
    }
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.post('/api/v1/createNodeType', async (req, res) => { 
    try {
        let apiKey = req.body.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        let typeName = req.body.typeName;
        let appSetting = req.body.appSetting;

        if (keyValid) {
            await dbConnection.createNodeType(typeName, appSetting);
            res.status(200).send({"status": "Success"});
        } else {
            res.status(401).send("Invalid API key");
        }
    } catch (err) {
        console.log(err.message);
        res.status(500).send(err.message);
    }
})

app.get("/api/v1/nodeTypes", async (req, res) => { 
    try {
        let apiKey = req.query.key;
        let keyValid = await dbConnection.validateAPIKey(apiKey);
        if (keyValid) {
            let data = await dbConnection.getNodeTypes();
            res.status(200).send(data);
        } else {
            res.status(401).send("Invalid API key");
        }
    }catch (err) {
        res.status(500).send(err.message);
    }
})

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

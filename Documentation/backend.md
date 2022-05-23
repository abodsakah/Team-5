# Back-end

To be able to run the application the envarionment variables need to be set. We are just using a simple `.env` file to store the variables.

The `.env` file is ignored by git, so that we dont misstakenly leak any personal information.

To be able to start just create a `.env` file in the root directory of the project and add the following lines:

```env
DB_HOST=<insert database host>
DB_LOGIN=<insert database username>
DB_PASSWORD=<insert database password>
DB_NAME=tract
DB_CHAR=utf8mb4
DB_MULTI=true
REACT_APP_TRACT_API_KEY=<insert api key>
```

## Files

You can configure the backend in the `./API` folder. The main entry point is the `index.js` file where all the routes are available.

In the src, We have the following files:

**dbConnection.js**
This is the file that is used to be able to get and manipulate data from the database.

**gatewayMqttConnect.js**
Establishes the connection to the MQTT broker.

**mobilixApiClient.js**
This is the file that is used to be able to get and manipulate data from the mobilix API.

**neoNodeMsgParser.js**
This is the file that is used to be able to parse the messages from the Neo node.

**neoNodeMsgSender.js**
This is the file that is used to be able to send messages to the Neo node.

**test-mobilix.js**
It is used to test if the connection to the mobilix API is working.

**testSendFunction.js**
Test sending messages to the neo-cortec mesh chips.

---

The backend has also a api to upload files and these files are stored in the `API/public/uploads` folder.
'use strict'

// const sender = require('./neoNodeMsgSender');
const dbConnection = require('./dbConnection'); // gets information from the database


// test sender functions.
async function test() {
    var res = await dbConnection.addLogicalDevice("22222222", "test-name", 3, 1, "DELETED", 1);
    console.log(res);
}
test();

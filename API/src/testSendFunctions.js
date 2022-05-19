'use strict'

const sender = require('./neoNodeMsgSender');


// test sender functions.
var status = sender.sendNeighborListRequest(1);
console.log(status);


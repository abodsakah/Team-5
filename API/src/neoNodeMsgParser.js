'use strict'
// Module with functions for handling
// JSON string data coming from the
// NeoCortec gateway

module.exports = {
  parseResponseData,
};

/**
 * Function for parsing the turning the data
 * into a JSON object and deciding what to do next.
 * @param data JSONstring the JSON string from the gateway node.
 * @returns
 */
async function parseResponseData(data) {
  var dataObj = JSON.parse(data);

  console.log('DATA: ' + data + '\n');
  // If the data is a neighborCall
  // loops and prints all neighbor node id's.
  switch (dataObj.objectType) {
    case 'neighborListReply':
      // mostly for testing purposes,
      // should maybe call something for a debug front-end.
      console.log('Incoming: neighborListReply');
      for (var node of dataObj.neighbors) {
        console.log('NodeId: ' + node.nodeId + '\n');
      }
      break;
    case 'receivedPayload':
      console.log('Incoming: receivedPayload');
      // call function for handling incoming message from some node.
      // JSON format:
      // {
      // "objectType":"receivedPayload",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "payloadType":"acknowledged",
      // "nodeId":32,
      // "port":0,
      // "packageAgeMicroSecs":750000,
      // "packageAgeType":"normal",
      // "payload":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
      // }
      break;
    case 'wesStatus':
      console.log('Incoming: wesStatus');
      // call function for handling/returning WES server status
      // can be ON = 1, or OFF = 0
      // JSON format:
      // {
      // "objectType":"wesStatus",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "status":0
      // }
      break;
    case 'wesSetupRequest':
      console.log('Incoming: wesSetupRequest');
      // call function to handle the WES setup request
      // should display data of requesting node in front-end somewhere.
      // JSON format:
      // {
      // "objectType":"wesSetupRequest",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "uidHex":"ffffffffff",
      // "appFunctionType":0
      // }
      break;
    default:
      console.log('objectType not found!!\n');
  }
}


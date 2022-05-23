'use strict'
// Module with functions for sending
// JSON string data to the
// NeoCortec gateway

const mqttGateway = require('./gatewayMqttConnect');
const dataBase = require('./dbConnection');
// const mobilixClient = require('./mobilixClientConnect');

module.exports = {
  sendNodeInfoRequest: sendNodeInfoRequest,
  sendNeighborListRequest: sendNeighborListRequest,
  sendWesServerStart: sendWesServerStart,
  sendWesServerStop: sendWesServerStop,
  sendWesServerStatus: sendWesServerStatus,
  sendForceWesMode: sendForceWesMode,
  sendWesSetupResponse: sendWesSetupResponse,
  deleteNode: deleteNode,
};

/* Base helper functions */

/**
 * Message type: nodeInfoRequest
 * Function for sending a nodeInfoRequest.
 * Makes a JSON string and sends it to the gateway.
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendNodeInfoRequest(companyId) {
  // Create message
  var objectType = 'nodeInfoRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log(message)
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: neighborListRequest
 * Function for sending a neighborListRequest.
 * Makes a JSON string and sends it to the gateway.
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendNeighborListRequest(companyId) {
  // Create message
  var objectType = 'neighborListRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log(message)
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for starting the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendWesServerStart(companyId) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 1}';

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log(message)
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for stopping the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendWesServerStop(companyId) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 0}';

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log(message)
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for getting the status of the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * Status: 0 for OFF, 1 for ON (will be returned as a outgoing packet from the
 * gateway and handled by the message reciever and parser).
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendWesServerStatus(companyId) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 2}';

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log(message)
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: networkCommand
 * Function for forcing a node with {nodeId} into WES mode.
 * Aka setting its nodeId to 0xFFFF temporarily. So it starts sending
 * wesSetupRequests. (changes back if it loses power, or to much time passes
 * before it recives a wesSetupResponse).
 * Makes a JSON string and sends it to the gateway.
 * @param nodeId INT: Id of the node to force into WES mode.
 * @param companyId String the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendForceWesMode(nodeId, companyId) {
  // Create message
  var message = '{"objectType": "networkCommand","nodeId": ' + nodeId +
      ',"cmd": 5,"payload":[2]}';

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log("Sending " + message + " to companyId: " + companyId);
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/**
 * Message type: wesResponse
 * Function for setting up a node with {uniqueId}.
 * To have the node id {nodeId} aswell as the app settings {appSettings}
 * Makes a JSON string and sends it to the gateway.
 * @param nodeId INT: Id of the node to setup.
 * @param uniqueId String: uniqueId(HEX) of the node to setup.
 * @param appSettings String: appSettings(HEX) of the node to setup.
 * @param companyId INT the companyId the message should be sent too.
 * @returns BOOLEAN
 */
async function sendWesSetupResponse(nodeId, uniqueId, appSettings, companyId) {
  // Create message
  var jsonObject = {};
  jsonObject.objectType = 'wesResponse';
  jsonObject.nodeId = nodeId;
  jsonObject.uidHex = uniqueId;
  jsonObject.appSettings = appSettings;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (await mqttGateway.isConnected()) {
    console.log("Sending " + message + " to companyId: " + companyId);
    return await mqttGateway.publishMsg(message, companyId);
  } else {
    return false;
  }
}

/* Combo functions */

/**
 * Function for deleting a node with {nodeId},
 * sends a database query to mark the node as "TBD" in the database.
 * Followed by a message to the node mesh network to force the node
 * into WESmode. The system will then handle the incoming setupRequest from this
 * node by setting it to 0xFFFF (DELETED aka Not setup) followed by setting the
 * status in the database as "DELETED" to mark that it is actually deleted.
 * @param nodeId INT: Id of the node to delete.
 * @param companyId INT: Identifier for the company associated with the node.
 * @returns BOOLEAN
 */
async function deleteNode(nodeId, companyId) {
  // Send to be delete query to database.
  await dataBase.setNodeToBeDeleted(nodeId, companyId);
  // check status and return early if something went wrong and status is not set.
  var status = await dataBase.getNodeStatus(nodeId, companyId);
  console.log("Status:" + status.status);
  if(status.status != "DELETED" && status.status != "TBD"){
    console.log("Something went wrong setting the status.");
    return false;
  }

  console.log(" BEFORE ForceWesMode");
  // Send ForceWesMode to Node.
  if (sendForceWesMode(nodeId, companyId)){
    return true;
  }else{
    return false;
  }
}


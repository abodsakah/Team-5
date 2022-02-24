'use strict'
// Module with functions for sending
// JSON string data to the
// NeoCortec gateway

const mqttGateway = require('./gatewayMqttConnect');

module.exports = {
  sendNodeInfoRequest: sendNodeInfoRequest,
  sendNeighborListRequest: sendNeighborListRequest,
  sendWesServerStart: sendWesServerStart,
  sendWesServerStop: sendWesServerStop,
  sendWesServerStatus: sendWesServerStatus,
  sendForceWesMode: sendForceWesMode,
  sendWesSetupResponse:sendWesSetupResponse,
};


/**
 * Message type: nodeInfoRequest
 * Function for sending a nodeInfoRequest.
 * Makes a JSON string and sends it to the gateway.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendNodeInfoRequest(topic) {
  // Create message
  var objectType = 'nodeInfoRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: neighborListRequest
 * Function for sending a neighborListRequest.
 * Makes a JSON string and sends it to the gateway.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendNeighborListRequest(topic) {
  // Create message
  var objectType = 'neighborListRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for starting the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendWesServerStart(topic) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 1}';

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for stopping the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendWesServerStop(topic) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 0}';

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
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
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendWesServerStatus(topic) {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 2}';

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: networkCommand
 * Function for forcing a node with {nodeId} into WES mode.
 * Aka setting its nodeId to 0xFFFF temporarily. So it starts sending
 * wesSetupRequests. (changes back if it loses power, or to much time passes
 * before it recives a wesSetupResponse)
 * Makes a JSON string and sends it to the gateway.
 * @param nodeId INT: Id of the node to force into WES mode.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendForceWesMode(nodeId, topic) {
  // Create message
  var message = '{"objectType": "networkCommand","nodeId": ' + nodeId +
      ',"cmd": 5,"payload":[2]}';

  // Send message
  if (mqttGateway.publishMsg(topic, message)) {  // <-- TODO: this function.
    return true;
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
 * @param nodeId String: appSettings(HEX) of the node to setup.
 * @param topic String the MQTT topic the message should be sent too.
 * @returns BOOLEAN
 */
function sendWesSetupResponse(nodeId, uniqueId, appSettings, topic) {
  // Create message
  var jsonObject = {};
  jsonObject.objectType = "wesResponse";
  jsonObject.nodeId = nodeId;
  jsonObject.uidHex = uniqueId;
  jsonObject.appSettings = appSettings;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (mqttGateway.publishMsg(message, topic)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}


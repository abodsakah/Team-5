'use strict'
// Module with functions for sending
// JSON string data to the
// NeoCortec gateway

/*
 * * Socket write function:
 * * The return value is true if the internal buffer
 * * is less than the highWaterMark configured when the stream was created
 * * after admitting chunk. If false is returned, further attempts to
 * * write data to the stream should stop until the 'drain' event is emitted.
 * * TODO: make nothing send when some value is set on full buffer,
 * * and allow sends again when 'drain' event triggers value to be changed.
 */

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
 * @returns BOOLEAN
 */
function sendNodeInfoRequest() {
  // Create message
  var objectType = 'nodeInfoRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: neighborListRequest
 * Function for sending a neighborListRequest.
 * Makes a JSON string and sends it to the gateway.
 * @returns BOOLEAN
 */
function sendNeighborListRequest() {
  // Create message
  var objectType = 'neighborListRequest';
  var jsonObject = {};
  jsonObject.objectType = objectType;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for starting the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @returns BOOLEAN
 */
function sendWesServerStart() {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 1}';

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}

/**
 * Message type: wesCmd
 * Function for stopping the gateway WES server.
 * Makes a JSON string and sends it to the gateway.
 * @returns BOOLEAN
 */
function sendWesServerStop() {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 0}';

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
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
 * @returns BOOLEAN
 */
function sendWesServerStatus() {
  // Create message
  var message = '{"objectType": "wesCmd","cmd": 2}';

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
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
 * @returns BOOLEAN
 */
function sendForceWesMode(nodeId) {
  // Create message
  var message = '{"objectType": "networkCommand","nodeId": ' + nodeId +
      ',"cmd": 5,"payload":[2]}';

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
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
 * @returns BOOLEAN
 */
function sendWesSetupResponse(nodeId, uniqueId, appSettings) {
  // Create message
  var jsonObject = {};
  jsonObject.objectType = "wesResponse";
  jsonObject.nodeId = nodeId;
  jsonObject.uidHex = uniqueId;
  jsonObject.appSettings = appSettings;
  var message = JSON.stringify(jsonObject);

  // Send message
  if (writeToGateWaysocket(message)) {  // <-- TODO: this function.
    return true;
  } else {
    return false;
  }
}


'use strict'
//
// Module for connecting to the MQTT broker tp receive and send messages.
//

const MQTT = require('async-mqtt');

const clientId = 'NodeJS-server'+Math.floor(Math.random()*1000);
// connection option
const options = {
  clean: true,  // retain session
  // Authentication information
  clientId: clientId,
  username: 'tract',
  password: 'mqtt-tract',
}

const IN_TOPIC = 'In/'; // to gateways
const OUT_TOPIC = 'Out/#'; // from gateways

const client = MQTT.connect('mqtt://localhost:8883', options);

// Called on sucessfull connection to setup subscriptions.
const setupSubs =
    async () => {
  console.log('Client ID: '+clientId);
  console.log('Connecting to MQTT topic...');
  try {
    // Subscribe to the Out/# wildcard topic
    console.log("MQTT: subscribing...");
    await client.subscribe(OUT_TOPIC);
    console.log('Connected = ' + client.connected);

    // send a command to start WES server on wildcard topic to all gateways
    var startWesCmd = '{"objectType": "wesCmd","cmd": 1}';
    console.log("MQTT: Sending startWesCmd...");
    await publishMsg(startWesCmd, "all");
  }
  catch (err) {
    console.log(err.stack);
    process.exit();
  }
}

                client.on('connect', setupSubs);

/**
  * get mqtt connection status
  * @returns {MQTT connection status} 
  */
async function isConnected() {
  return client.connected;
}

/**
 * Async Function for sending a JSONstring {message} to the MQTT
 * companyId {companyId}. Makes a JSON string and sends it to the gateway.
 * @param companyId INT the companyId the message should be sent too.
 * @param message JSONstring the JSON string message to publish.
 * @returns BOOLEAN
 */
async function publishMsg(message, companyId) {
  // Create topic
  var topic = IN_TOPIC+companyId
  // send message if client is connected.
  if (client.connected == true) {
    try {
      await client.publish(topic, message);
      return true;
    } catch (e) {
      /* handle error */
      console.error(e.stack);
      return false;
    }
  } else {
    console.log('Message not published, Client not connected!');
    return false;
  }
}

// Termination handler.
const handleExit =
    async () => {
  console.log('Starting MQTT client termination');
  try {
    await client.end();
    // This line doesn't run until the client has disconnected without error
    console.log('MQTT client termination done');
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

process.on('exit', handleExit);
process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);

module.exports = {
  publishMsg: publishMsg,
  isConnected: isConnected,
  mqttClient: client
};


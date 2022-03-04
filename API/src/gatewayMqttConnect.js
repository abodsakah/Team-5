'use strict'
//
// Module for connecting to the MQTT broker tp receive and send messages.
//

const MQTT = require('async-mqtt');
const msgParser = require('./neoNodeMsgParser');

module.exports = {
  publishMsg: publishMsg,
};

const clientId = 'NodeJS-server'+Math.floor(Math.random()*1000);
// connection option
const options = {
  clean: true,  // retain session
  // Authentication information
  clientId: clientId,
  username: 'flex',
  password: 'mqtt-flex',
}

const IN_TOPIC = 'In/';
const OUT_TOPIC = 'Out/#';

const client = MQTT.connect('mqtt://139.162.146.61:8883', options);

// Called on sucessfull connection to setup subscriptions.
const setupSubs =
    async () => {
  console.log('Client ID: '+clientId);
  console.log('Connecting to MQTT topic...');
  try {
    // Subscribe to the Out/# wildcard topic
    await client.subscribe(OUT_TOPIC);
    console.log('Connected = ' + client.connected);
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

                client.on('connect', setupSubs);

/**
 * Async Function for sending a JSONstring {message} to the MQTT
 * companyId {companyId}. Makes a JSON string and sends it to the gateway.
 * @param companyId String the companyId the message should be sent too.
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

// event will trigger when a message comes in on a topic we are subscribed too.
client.on('message', function(topic, message) {
  // call parser function.
  msgParser.parseMsgData(message, topic);
})

// Termination handler.
const handleExit =
    async () => {
  console.log('Starting process termination');
  try {
    await client.end();
    // This line doesn't run until the client has disconnected without error
    console.log('Process termination done');
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

                process.on('SIGINT', handleExit);
process.on('SIGQUIT', handleExit);
process.on('SIGTERM', handleExit);


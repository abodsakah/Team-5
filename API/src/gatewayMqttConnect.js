'use strict'

const MQTT = require('async-mqtt');
const msgParser = require('./neoNodeMsgParser');

// connection option
const options = {
  clean: true,  // retain session
  // Authentication information
  clientId: 'NodeJs-test-client',
  username: 'flex',
  password: 'mqtt-flex',
}

const client = MQTT.connect('mqtt://139.162.146.61:8883', options);

// When passing async functions as event listeners, make sure to have a try
// catch block

const setupSubs =
    async () => {
  console.log('Connecting to MQTT topic...');
  try {
    // Subscribe to the Out/# wildcard topic
    await client.subscribe('Out/#');
    console.log('Connection made to MQTT topic sucessfully!');
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

                client.on('connect', setupSubs);

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


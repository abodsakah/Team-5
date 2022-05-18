'use strict'

const MQTT = require('async-mqtt');

// connection option
const options = {
  clean: true,           // retain session
  // Authentication information
  clientId: 'NodeJs-test-client',
  username: 'flex',
  password: 'mqtt-flex',
}

const client = MQTT.connect('mqtt://noahhakansson.com:8883/', options);
// const client = MQTT.connect('ws://broker.emqx.io/mqtt:8083', options);

// When passing async functions as event listeners, make sure to have a try
// catch block

const doStuff =
    async () => {
  console.log('Starting');
  try {
    // subscribe to topic test
    await client.subscribe('test/1');
    await client.subscribe('test/all');
    // send message to topic test
    await client.publish('test/all', 'ALL: It works!');
    await client.publish('test/1', '1: It works!');
    // This line doesn't run until the server responds to the publish
    await client.end();
    // This line doesn't run until the client has disconnected without error
    console.log('Done');
  } catch (e) {
    // Do something about it!
    console.log(e.stack);
    process.exit();
  }
}

                client.on('connect', doStuff);

// event will trigger when a message comes in on a topic we are subscribed too.
client.on('message', async function(topic, message) {
  // message is Buffer
  console.log(message.toString());
  client.end();
})

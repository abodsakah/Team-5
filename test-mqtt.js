'use strict'

const MQTT = require('async-mqtt');

// connection option
const options = {
  clean: true,           // retain session
  // Authentication information
  clientId: 'NodeJs-test-client',
  username: 'flex',
  password: '',
}

const client = MQTT.connect('mqtt://mqtt.abodsakka.xyz/', options);
// const client = MQTT.connect('ws://broker.emqx.io/mqtt:8083', options);

// When passing async functions as event listeners, make sure to have a try
// catch block

const doStuff =
    async () => {
  console.log('Starting');
  try {
    // subscribe to topic test
    await client.subscribe('test');
    // send message to topic test
    await client.publish('test', 'It works!');
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

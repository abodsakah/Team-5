'use strict'

const neoNodeMsgSender = require("./neoNodeMsgSender");
const mqttGateway = require('./gatewayMqttConnect');
const dataBase = require('./dbConnection');
const gatewayMqttConnect = require("./gatewayMqttConnect");

// Module with functions for handling
// JSON string data coming from the
// NeoCortec gateway


let nodes = [];
let nodeInfo = [];
/*
 * Variables
 */
class Queue {
  constructor() {
    this.data = [];
  }
  enqueue(element) {
    return this.data.push(element);
  }
  dequeue() {
    return this.data.shift();
  }
  peek() {
    return this.data[0];
  }
  length() {
    return this.data.length;
  }
}

const SWITCH_CLOSED = 32764;
const queue = new Queue;
const DELETE_ID = 65535;
const DELETE_SETTINGS = "000000000000000000000000000000000000000000000000";

/*
 * Functions
 */
function getMsgQueue(){
  return queue;
}

// event will trigger when a message comes in on a topic we are subscribed too.
gatewayMqttConnect.mqttClient.on('message', function(topic, message) {
  // call parser function.
  parseMsgData(message, topic);
})

/**
 * Function for parsing the turning the data
 * into a JSON object and deciding what to do next.
 * Calls function to take action depending on message type.
 * @param data JSONstring the JSON string from the gateway node.
 * @param topic String the MQTT topic of the message.
 * @returns *TODO* Will call appropriate function and *maybe* return anything.
 */
async function parseMsgData(data, topic) {
  var dataObj = JSON.parse(data);
  // add JSON object to queue
  queue.enqueue(dataObj);
  if (queue.length() > 50) {
    queue.dequeue();
  }

  console.log('--------------------------------');
  console.log('Incoming Data:\n' + data + '\n');
  console.log(
      'Payload: ' +
      '[' + dataObj.payload + ']' +
    '\n');
  console.log('From topic: ' + topic + '\n');

  // If the data is a neighborCall
  // loops and prints all neighbor node id's.
  switch (dataObj.objectType) {
    case 'neighborListReply':
      // call function for handling incoming message from some node.
      // JSON format:
      //{
      //"objectType":"neighborListReply",
      //"gwTimestamp":"2016-11-09T16:00:00.000Z",
      //“nodeId”:1, “RSSI”:1
      //“nodeId”:2, “RSSI”:2
      //“nodeId”:4, “RSSI”:4
      //“nodeId”:8, “RSSI”:8
      //“nodeId”:9, “RSSI”:9
      //“nodeId”:10, “RSSI”:10
      //}

      console.log('Incoming message type: neighborListReply');
      for (var node of dataObj.neighbors) {
        console.log('NodeId: ' + node.nodeId + '\n');
        console.log(nodes)
        if (nodes.length > 0) {
          nodes = []
        }

        for (var node of dataObj.neighbors) {
          nodes.push({
            nodeId: node.nodeId,
            RSSI: node.RSSI
          });
        }
      }
      break;
    case 'receivedPayload':
      console.log('Incoming message type: receivedPayload');
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

      console.log(
          'Incoming message: ' +
          '\n');
      var preId = dataObj.payload[0];
      switch (preId) {
        case 1:
          // temperature sensor
          var tempData =
              dataObj.payload[1].toString(16) + dataObj.payload[2].toString(16);
          tempData = parseInt(tempData, 16);
          var humidityData =
              dataObj.payload[3].toString(16) + dataObj.payload[4].toString(16);
          humidityData = parseInt(humidityData, 16);

          console.log('Temperature: ' + convertToCelsius(tempData) + 'C');
          console.log('Humidity: ' + getHumidity(humidityData) + '%');

          break;
        case 2:
          // switch sensor
          var switchData =
              dataObj.payload[5].toString(16) + dataObj.payload[6].toString(16);
          switchData = parseInt(switchData, 16);

          if (switchData == SWITCH_CLOSED) {
            console.log('Switch closed!');
          } else {
            console.log('Switch open!');
          }

          break;
        case 3:
          // potentiometer
          var analogData =
              dataObj.payload[5].toString(16) + dataObj.payload[6].toString(16);
          analogData = parseInt(analogData, 16);

          console.log('Analog value: ' + analogData);

          break;
        default:
          console.log('Invalid sensor type');
          break;
      }


      break;
    case 'nodeInfoReply':
      console.log('Incoming message type: nodeInfoReply');
      // call function for handling incoming message from some node.
      // JSON format:
      // {
      // "objectType":"nodeInfoReply",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // “nodeId”:50,
      // “uidHex”:”ffffffffff”,
      // “nodeType”:1
      // }
      console.log(dataObj);
      if (nodeInfo.length > 0) {
        // find the node with the same nodeId
        for (var node of nodeInfo) {
          if (node.nodeId == dataObj.nodeId) {
            nodeInfo.splice(nodeInfo.indexOf(node), 1);
            break;
          }
        }

      }
      nodeInfo.push(dataObj);
      break;
    case 'wesStatus':
      console.log('Incoming message type: wesStatus');
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
      console.log('Incoming message type: wesSetupRequest');
      // call function to handle the WES setup request
      // should display data of requesting node in front-end somewhere.
      // JSON format:
      // {
      // "objectType":"wesSetupRequest",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "uidHex":"ffffffffff",
      // "appFunctionType":0
      // }
      var uid = dataObj.uidHex;
      var node = await dataBase.getNodeFromUid(uid);

      if(node == null){
        console.log("setupRequest uid not found, database returned NULL");
        return; // exit early if we cant find node in database.
      }
      if(node.status == "deleted"){
        await neoNodeMsgSender.sendWesSetupResponse(DELETE_ID,uid,DELETE_SETTINGS,node.company_id);
      }else{
        await neoNodeMsgSender.sendWesSetupResponse(node.id,uid,node.app_settings,node.company_id);
      }

      break;
    case 'networkCommandReply':
      console.log('Incoming message type: networkCommandReply');
      // call function to handle the WES setup request
      // should display data of requesting node in front-end somewhere.
      // JSON format:
      // {
      // "objectType":"networkCommandReply",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // “nodeId”:50,
      // “command”:0,
      // "payload":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]
      // }
      break;
    case 'ack':
      console.log('Incoming message type: ack');
      // call function to handle the WES setup request
      // should display data of requesting node in front-end somewhere.
      // JSON format:
      // {
      // "objectType":"ack",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "nodeId":32
      // }
      break;
    case 'nack':
      console.log('Incoming message type: nack');
      // call function to handle the WES setup request
      // should display data of requesting node in front-end somewhere.
      // JSON format:
      // {
      // "objectType":"nack",
      // "gwTimestamp":"2016-11-09T16:00:00.000Z",
      // "nodeId":32
      // }
      break;
    default:
      console.log('objectType not found!!\n');
  }
}


// Private Help Functions


// Returns the correct temperature in celsius from recieved payload
function convertToCelsius(data) {
  return data / (2 ** 16) * 175.72 - 46.85;
}

// Returns the correct humidity level from recieved payload
function getHumidity(data) {
  return data / (2 ** 16) * 125 - 6;
}
/**
 * 
 * @returns The nighbor list of the node
 */
function getNodes() {
  return nodes;
}  

function getNodesInfo() {
  return nodeInfo;
}

module.exports = {
  parseMsgData: parseMsgData,
  getMsgQueue: getMsgQueue,
  getNodes: getNodes,
  getNodesInfo,
  nodes: nodes,
};

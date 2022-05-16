'use strict'

const neoNodeMsgSender = require("./neoNodeMsgSender");
const mqttGateway = require('./gatewayMqttConnect');
const dataBase = require('./dbConnection');
const gatewayMqttConnect = require("./gatewayMqttConnect");
const mobilixClient = require("./mobilixApiClient");

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

const UNDER = -1;
const SAME = 0;
const OVER = 1;

/*
 * Functions
 */
function getMsgQueue() {
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
  var companyId = topic.split('/')[1];
  companyId = parseInt(companyId);

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
  console.log('From companyId: ' + companyId + '\n');
  console.log("company id type: " + typeof (companyId) + "\n");
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

      // pase object array and convert to an array
      console.log('Incoming message type: neighborListReply');
      for (var node of dataObj.neighbors) {
        console.log('NodeId: ' + node.nodeId + '\n');
        if (nodes.length > 0) {
          nodes = []
        }

        for (var node of dataObj.neighbors) {
          nodes.push({
            nodeId: node.nodeId,
            RSSI: node.RSSI
          });
        }
        console.log(nodes)
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

      // Check the nodes status, unless it's "ACTIVE" we dont process it's payload.

      // We also want to do a retry removing a node if we get a message from it with status
      // "DELETED" or "TBD" (to be deleted)
      var nodeStatus = await dataBase.getNodeStatus(dataObj.nodeId, companyId);
      nodeStatus = nodeStatus.status;
      console.log("Status: " + nodeStatus);
      if (nodeStatus == "DELETED" || nodeStatus == "TBD") {
        console.log("Ignoring payload: node should be deleted! Will retry deleting it.");
        neoNodeMsgSender.deleteNode(dataObj.nodeId, companyId);
        return;
      }
      // check if node is already "REPORTED"
      // If a active workorder already exists we can return early
      // otherwise if no active workOrder exists we can set node status to "ACTIVE" again
      if (nodeStatus == "REPORTED") {
        if (await mobilixClient.workOrderExists(dataObj.nodeId, companyId) == undefined) {
          console.log("A active workOrder does not already exist despite",
            "node being flagged as REPORTED, assuming workOrder as resolved",
            "and changing node status back to ACTIVE");
          dataBase.logEvent("Sensor " + dataObj.nodeId + " workOrder has been resolved, sensor now set to active.", companyId);
          await dataBase.setNodeAsActive(dataObj.nodeId, companyId);
          return;
        } else {
          console.log("Active workOrder already exists for node: ", dataObj.nodeId, " company: ", companyId);
          return;
        }
      }

      // check node type in database
      var nodeType = await dataBase.getNodeType(dataObj.nodeId, companyId);
      nodeType = nodeType.type;
      // get threshold id of node
      var nodeInfo = await dataBase.getNodeInfo(dataObj.nodeId, companyId);
      var nodeThresholdId = nodeInfo.trigger_action;
      // get the nodes threshold
      var nodeThreshold = await dataBase.getThreshold(nodeThresholdId);


      var nodePayload;

      // Print out payload information to console
      console.log("Node type id: " + nodeType + "\n");
      console.log('Incoming message: ' + '\n');
      switch (nodeType) {
        case 1:
          // temperature sensor
          var tempData =
            dataObj.payload[1].toString(16) + dataObj.payload[2].toString(16);
          tempData = parseInt(tempData, 16);
          var humidityData =
            dataObj.payload[3].toString(16) + dataObj.payload[4].toString(16);
          humidityData = parseInt(humidityData, 16);

          var celsius = convertToCelsius(tempData);
          var humidity = getHumidity(humidityData);

          console.log('Temperature: ' + celsius + 'C');
          console.log('Humidity: ' + humidity + '%');
          nodePayload = celsius;
          break;
        case 2:
          // switch sensor
          var switchData =
            dataObj.payload[5].toString(16) + dataObj.payload[6].toString(16);
          switchData = parseInt(switchData, 16);

          var switchStatus = "";

          if (switchData == SWITCH_CLOSED) {
            console.log('Switch closed!');
            switchStatus = "CLOSED";
            nodePayload = 0;
          } else {
            console.log('Switch open!');
            switchStatus = "OPEN";
            nodePayload = 1;
          }

          break;
        case 3:
          // analog-wheel
          var analogData =
            dataObj.payload[5].toString(16) + dataObj.payload[6].toString(16);
          analogData = parseInt(analogData, 16);

          console.log('Analog value: ' + analogData);

          nodePayload = analogData;
          break;
        default:
          console.log('Invalid sensor type');
          break;
      }

      // Check payload data and create a report if needed
      console.log("Node Payload: " + nodePayload);
      console.log("Node Threshold: " + nodeThreshold.threshold);
      console.log("Node Action: " + nodeThreshold.action);

      var payloadToThresholdDifferential = nodePayload - nodeThreshold.threshold;
      var payloadToThresholdSign = Math.sign(payloadToThresholdDifferential);

      var thresholdActionSign;
      switch (nodeThreshold.action) {
        case "UNDER":
          thresholdActionSign = UNDER;
          break;
        case "SAME":
          thresholdActionSign = SAME;
          break;
        case "OVER":
        default:
          thresholdActionSign = OVER;
          break;
      }

      // Create work order
      if (payloadToThresholdSign === thresholdActionSign) {



        var workOrderDescription = "Workorder assigned to asset ";
        var workOrderTitle = "Workorder for " + nodeInfo.name;

        // Get asset associated with the node
        var asset = await dataBase.getAssetFromNodeId(dataObj.nodeId);

        if (asset == undefined) {
          return console.log("Asset to node does not exist, return error");
        }

        workOrderDescription = workOrderDescription.concat(asset.name + ",");

        // Get all spaces the asset is located in
        var space = await dataBase.getSpaceFromId(asset.located_in);

        var nodeSpaces = [];
        nodeSpaces.push(space);
        var childSpaceId = space.is_part_of;

        while (childSpaceId != undefined) {
          var childSpace = await dataBase.getSpaceFromId(childSpaceId);
          nodeSpaces.push(childSpace);
          childSpaceId = childSpace.is_part_of;
        }

        nodeSpaces.forEach(space => workOrderDescription = workOrderDescription.concat(" in " + space.name + ","));


        // check if work order for node doesnt already exist
        if (await mobilixClient.workOrderExists(dataObj.nodeId, companyId)) {
          console.log("Active workOrder already exists for node: ", dataObj.nodeId, " company: ", companyId);
          return undefined;
        }

        // Create work order in mobilix
        console.log("\nCreating Work Order!!");
        await dataBase.setNodeAsReported(dataObj.nodeId, companyId);
        var workOrder = mobilixClient.createWorkOrder(dataObj.nodeId, companyId, workOrderTitle, workOrderDescription);
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

      // Gets node info from database using UID and sends a setupResponse
      // if node is not null
      var uid = dataObj.uidHex;
      var node = await dataBase.getNodeFromUid(uid);
      console.log("setupRequest nodeStatus: " + node.status);

      if (node == null) {
        console.log("setupRequest node uid not found, database returned NULL");
        return; // exit early if we cant find node in database.
      }
      if (node.status == "ACTIVE") {
        await neoNodeMsgSender.sendWesSetupResponse(node.id, uid, node.app_settings, node.company_id);
      }
      else if (node.status == "TBD") {
        await neoNodeMsgSender.sendWesSetupResponse(DELETE_ID, uid, DELETE_SETTINGS, node.company_id);
        await dataBase.setNodeASDeleted(node.id, node.company_id);
      }
      else if (node.status == "DELETED") {
        console.log("Ignoring setupRequest: Node is already deleted permanently.");
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

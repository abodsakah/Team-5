"use strict"
// Module with functions for handling
// JSON string data coming from the
// NeoCortec gateway

module.exports = {
    parseData,
};

/** Function for parsing the turning the data
 * into a JSON object and deciding what to do next.
 * @param data JSONstring the JSON string from the gateway node.
 * @returns
 */
async function parseData(data) {
  var dataObj = JSON.parse(data);

  console.log('DATA: ' + data+ '\n');
  // If the data is a neighborCall
  // loops and prints all neighbor node id's.
  switch (dataObj.objectType) {
    case "neighborListReply":
      for (var node of dataObj.neighbors) {
        console.log('NodeId: ' + node.nodeId+ '\n');
      }
      break;

    default:

  }
  if(dataObj.objectType == "neighborListReply"){
  }
}


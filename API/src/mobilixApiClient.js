'use strict'
//
// Module for connecting to the Mobilix client.
//

const axios = require('axios');
const jwt_decode = require('jwt-decode');
const mobilixClient = require('@allbin/mobilix-api-client');
const dotenv = require('dotenv').config();
const fs = require('fs');


const client = mobilixClient.MobilixApiClient({
  baseUrl: 'https://api.mobilix.dev.allbin.se',
  token: () => getTokenPromise(),
})

const CLIENT_ID = dotenv.parsed.CLIENT_ID;
const CLIENT_SECRET = dotenv.parsed.CLIENT_SECRET;
var expDate = new Date(0);
var token = null;
var entityTypeId = null;
var entitySchemaId = null;


const data = JSON.stringify({
  "audience": "https://api.mobilix.dev.allbin.se",
  "grant_type": "client_credentials",
  "client_id": CLIENT_ID,
  "client_secret": CLIENT_SECRET,
  "tenant": "allbinary-dev"
});


var config = {
  method: 'post',
  url: 'https://allbin.eu.auth0.com/oauth/token',
  headers: {
    'Content-Type': 'application/json'
  },
  data: data
};

/** 
* get token exp date
 */
function getExpDate(jwToken) {
  // get token exp date
  var theExpDate = new Date(0);

  try {
    var decodedToken = jwt_decode(jwToken);
    var exp = decodedToken.exp;
    theExpDate = new Date(exp * 1000);

  } catch (error) {
    console.error(error);
  }
  return theExpDate;
}

function saveTokenToFile(jwToken) {
  try {
    fs.writeFileSync('.mobilix-token', jwToken);
    console.log("Saving JWT to file...");
  } catch (err) {
    console.error(err);
  }
}

/** 
* reads from file and sets token and expDate
* if no token is read, expDate is set to 0
 */
function readTokenFromFile() {
  try {
    token = fs.readFileSync('.mobilix-token', 'utf8')
    console.log("Loading JWT from file...");
    // get token exp date
    expDate = getExpDate(token);
  } catch (err) {
    console.error(err);
    expDate = new Date(0);
  }
}

async function getTokenPromise() {
  // Check if token is null
  if (token == null) {
    // try to get old token from file
    readTokenFromFile();
  }
  // if we still have a valid token don't fetch a new one.
  if (Date.now() >= expDate.getTime()) {
    try {
      var res = await axios(config, data);
      token = res.data.access_token;
      // save token to file
      saveTokenToFile(token);
      // get token exp date
      expDate = getExpDate(token);
      console.log("Token is not valid, returning new JWT token.");
    } catch (err) {
      console.error(err);
      console.log("Something went wrong, trying to fetch token.");
    }
    return token;
  }
  // return old token
  else {
    console.log("Token is still valid, returning old JWT token");
    return token;
  }
};

/**
 * Creates entityType neocortec-node if it doesnt exists.
 * Also creates a entitySchema for this entityType if it doesn't exists.
 * Sets file global variables 'entityTypeId' and 'entitySchemaId'
 * to be used by other functions in this file.
*/
async function setupMobilixClient() {
  var entityTypeList = await client.entityTypes.list();
  var entitySchemaList = await client.entitySchemas.list();

  /* Create entityType */
  // only create entityType 'neocortec-node' if it doesn't exists.
  var eType = entityTypeList.find(element => element.name === 'neocortec-node')
  if (eType) {
    entityTypeId = eType.id;
    console.log('entityType { name: "neocortec-node" } found');
    console.log("ID: ", entityTypeId);
  }
  else {
    console.log('entityType not found, creating entityType { name: "neocortec-node" }');
    var res = await client.entityTypes.create({ name: "neocortec-node" });
    entityTypeId = res.id;
    console.log("ID: ", entityTypeId);
  }

  /* Create entitySchema */
  // only create entitySchema for 'neocortec-node' if it doesn't exists.
  var eSchema = entitySchemaList.find(element => element.entity_type_id === entityTypeId)
  if (eSchema) {
    console.log('entitySchema found');
    entitySchemaId = eSchema.id;
    console.log("ID: ", entitySchemaId);
  }
  else {
    console.log('entitySchema not found, creating one');
    var def = {
      "groups": [],
      "properties": [
        { "key": "meta.id", "type": "number", "name": "ID" },
        { "key": "meta.company_id", "type": "number", "name": "Företags_ID" },
      ]
    };
    var res = await client.entitySchemas.create({ entity_type_id: entityTypeId, definition: def });
    entitySchemaId = res.id;
  }
  console.log("Mobilix setup completed!");
}


/*
 * Useful Functions
 */

/**
 * IGNORE, DOESN'T WORK, DONT HAVE ACCESS!!!
 * Marks a workOrder as completed by setting it's 'state' key to 'completed'.
 * @param {String} workOrderId 
 * @returns {} True, or False if something went wrong.
 */
async function setWorkOrderStateCompleted(workOrderId) {
  try {
    var workOrderList = await client.workOrders.list();
    var workOrder = workOrderList.find(element => element.id === workOrderId);

    // set state to 'completed'
    workOrder.state = 'accepted';

    // update workOrder
    await client.workOrders.update(workOrderId, workOrder);

    return false;
  } catch (err) {
    console.error(err);
    return false;
  }
}

/**
 * (For testing)
 * Function to delete all workOrders in Mobilix
 */
async function deleteAllWorkOrders() {
  try {
    var workOrders = await client.workOrders.list();
    var id = "";

    for (let i = 0; i < workOrders.length; i++) {
      const workOrder = workOrders[i];
      id = workOrder.id;
      await client.workOrders.delete(id);
    }
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get a list of all workOrders associated with a companyId.
 * @param {Int} companyId 
 * @returns {} List of workOrder objects, or an empty array.
 * Otherwise undefined. 
 */
async function getCompanyWorkOrders(companyId) {
  try {
    // Get all entities with matching companyId 
    var companyEntities = [];
    var entityList = await client.entities.list();

    entityList.forEach((entity) => {
      if (entity.properties["meta.company_id"] == companyId) {
        companyEntities.push(entity);
      }
    });
    // Get all workOrders that match an entity_id in our 'companyEntities' array
    var companyWorkOrders = [];
    var workOrderList = await client.workOrders.list();

    workOrderList.forEach((workOrder) => {
      companyEntities.forEach((entity) => {
        if (workOrder.entities.find(e => e === entity.id)) {
          workOrder.node_id = entity.properties["meta.id"];
          workOrder.company_id = entity.properties["meta.company_id"];
          companyWorkOrders.push(workOrder);
        }
      });
    });

    return companyWorkOrders;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Get a list of all active workOrders associated with a companyId.
 * @param {Int} companyId 
 * @returns {} List of active workOrder objects, or an empty array.
 * Otherwise undefined. 
 */
async function getActiveCompanyWorkOrders(companyId) {
  try {
    var activeWorkOrders = [];
    var workOrders = await getCompanyWorkOrders(companyId);

    workOrders.forEach((workOrder) => {
      if (workOrder.state != 'completed') {
        activeWorkOrders.push(workOrder);
      }
    });

    return activeWorkOrders;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Get active workOrder for a nodeId + companyId combo.
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @returns {} Returns the workOrder object with nodeId and companyId added,
 * or undefined otherwise. 
 */
async function getActiveWorkOrder(nodeId, companyId) {
  try {
    var entityId = await getEntityId(nodeId, companyId);
    var orderList = await client.workOrders.list();
    var workOrder = orderList.find(element => element.entities.find(e => e === entityId));

    // if workOrder is 'completed' we dont count it.
    if (workOrder.state == 'completed') {
      return undefined;
    }

    workOrder.node_id = nodeId;
    workOrder.company_id = companyId;

    return workOrder;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Get entity for a nodeId + companyId combo.
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @returns {} Returns the entity object, or undefined otherwise. 
 */
async function getEntity(nodeId, companyId) {
  try {
    var source_id = nodeId + ":" + companyId;
    var entity_list = await client.entities.list();
    var entity = entity_list.find(element => element.source_id === source_id);

    return entity;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Get entity_id for a nodeId + companyId combo.
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @returns {} Returns the entity ID as a String, or undefined otherwise. 
 */
async function getEntityId(nodeId, companyId) {
  try {
    var entity = await getEntity(nodeId, companyId);
    var id = entity.id;

    return id;
  } catch (err) {
    console.error(err);
    return undefined;
  }
}

/**
 * Checks if an active workOrder exists for an entity_id
 * A workOrder with state 'completed' does not count as a active workOrder.
 * @param {String} entityId 
 * @returns {} Returns the workOrder ID as a String, or undefined otherwise.
 */
async function workOrderExistsForEntity(entityId) {
  try {
    var orderList = await client.workOrders.list();
    var workOrder = orderList.find(element => element.entities.find(e => e === entityId));

    if (workOrder == undefined) {
      return undefined;
    }

    // if workOrder is 'completed' we dont count it.
    if (workOrder.state == 'completed') {
      return undefined;
    }
    var id = workOrder.id;

    return id;
  }
  catch (err) {
    console.error(err);
    return undefined;
  }

}

/**
 * Checks if an active workOrder exists for a nodeId + companyId combo.
 * A workOrder with state 'completed' does not count as a active workOrder.
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @returns {} Returns the workOrder ID as a String, or undefined otherwise.
 */
async function workOrderExists(nodeId, companyId) {
  try {
    var entityId = await getEntityId(nodeId, companyId);
    var workOrderId = await workOrderExistsForEntity(entityId);

    return workOrderId;
  }
  catch (err) {
    console.error(err);
    return undefined;
  }

}

/**
 * Creates a workOrder and connects it to an entity coresponding
 * to the nodeId and companyId passed in as a parameter.
 * If an entity doesn't exists for the node, one is created.
 * 
 * A workOrder is only created if no active workOrder already
 * exists for this nodeId+companyId.
 * If a workOrder exists but is in the 'completed' state
 * it is not counted as an active workOrder.
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @param {String} title 
 * @param {String} description 
 * @returns {} Returns the workOrder object, or undefined otherwise.
 */
async function createWorkOrder(nodeId, companyId, title, description) {
  // try to create entity for node if it doesn't exists.
  try {
    console.log("Trying to create entity");
    await createEntity(nodeId, companyId);
  }
  catch (err) {
    console.log(err);
    console.log("Something went wrong, enitity probably already exists");
  }

  // Check that nodeId, companyId combo doesn't already have an active workOrder
  var entityId = await getEntityId(nodeId, companyId);
  if (await workOrderExistsForEntity(entityId)) {
    console.log("Active workOrder already exists for node: ", nodeId, " company: ", companyId);
    return undefined;
  }

  // Create workOrder
  var workOrder = await client.workOrders.create(
    {
      entity_type_id: entityTypeId,
      title: title,
      description: description,
      state: "created",
      tags: [],
      contractors: [],
      entities: [entityId],
      entity_changesets: {}
    }
  );

  return workOrder;
}

/**
 * Creates a entity if it doesn't already exists.
 * source_id for entity is "nodeId:companyId"
 * @param {Int} nodeId 
 * @param {Int} companyId 
 * @returns {} Returns the entity object, or undefined otherwise.
 */
async function createEntity(nodeId, companyId) {
  try {
    // test add entity
    var metaId = nodeId;
    var sourceId = nodeId + ":" + companyId;
    var props = {
      "meta.id": metaId,
      "meta.company_id": companyId
    };

    var entity = await client.entities.create(
      {
        entity_type_id: entityTypeId,
        properties: props,
        source_id: sourceId
      });

    return entity;
  }
  catch (err) {
    console.error(err);
    return undefined;
  }
}

setupMobilixClient();

module.exports = {
  createWorkOrder,
  workOrderExists,
  getActiveWorkOrder,
  getCompanyWorkOrders,
  getActiveCompanyWorkOrders,
  deleteAllWorkOrders,
}



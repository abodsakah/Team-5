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
    fs.writeFile('.mobilix-token', jwToken);
    console.log("Saved JWT to file");
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
    console.log("Loading token from file:\n", token, "\n");
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
      const res = await axios(config, data);
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

async function setupMobilixClient() {
  var entityTypeList = await client.entityTypes.list();
  var entitySchemaList = await client.entitySchemas.list();
  var entityList = await client.entities.list();
  var entityTypeId = null;
  var entitySchemaId = null;

  console.log(token);
  console.log("entityTypeList:\n", entityTypeList);
  console.log("entitySchemaList:\n", entitySchemaList);
  console.log("entityList:\n", entityList);

  /* Create entityType */
  // only create entityType 'neocortec-node' if it doesn't exists.
  var eType = entityTypeList.find(element => element.name === 'neocortec-node')
  if (eType) {
    console.log('entityType { name: "neocortec-node" } found');
    console.log(eType);
    entityTypeId = eType.id;
    console.log("ID: ", entityTypeId);
  }
  else {
    console.log('entityType not found, creating entityType { name: "neocortec-node" }');
    var res = await client.entityTypes.create({ name: "neocortec-node" });
    console.log(res);
    entityTypeId = res.id;
    console.log("ID: ", entityTypeId);
  }

  /* Create entitySchema */
  // only create entitySchema for 'neocortec-node' if it doesn't exists.
  var eSchema = entitySchemaList.find(element => element.entity_type_id === entityTypeId)
  if (eSchema) {
    console.log('entitySchema found');
    console.log(eSchema);
    entitySchemaId = eSchema.id;
    console.log("ID: ", entitySchemaId);
    console.log("Properties: ", eSchema.definition.properties);
  }
  else {
    console.log('entitySchema not found, creating one');
    var def = {
      "groups": [],
      "properties": [
        { "key": "meta.id", "type": "string", "name": "ID" },
        { "key": "meta.company_id", "type": "string", "name": "Företags_ID" },
      ]
    };
    var res = await client.entitySchemas.create({ entity_type_id: entityTypeId, definition: def });
    console.log(res);
    entitySchemaId = res.id;
    console.log("ID: ", entitySchemaId);
    console.log("Properties: ", res.definition.properties);
  }

  // test add entity
  var props = {
    "meta.id": "1234",
    "meta.company_id": "999"
  };
  console.log(props);
  var res = await client.entities.create({ entity_type_id: entityTypeId, properties: props});

  // var res = await client.entitySchemas.delete(entitySchemaId);
  console.log("Schema: ",await client.entitySchemas.list());
}

setupMobilixClient();



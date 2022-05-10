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
    console.log("Token from file:\n", token, "\n");
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
  var entityTypes = await client.entityTypes.list();
  console.log(token);
  console.log(entityTypes);

  // only create entityType 'neocortec-node' if it doesn't exists.
  if (!entityTypes.find(element => element.name === 'neocortec-node')) {
    var res = await client.entityTypes.create({ "name": "neocortec-node" });
    console.log(res);
  }
  // const userList = await client.users.list();
  // const workorders = await client.workOrders.listEvents();
  // console.log(userList.entries);
  // console.log(workorders);
}
setupMobilixClient();
// async function testTokenPromise() {
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
// }
// testTokenPromise();




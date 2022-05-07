'use strict'
//
// Module for connecting to the Mobilix client.
//

const axios = require('axios');
const jwt_decode = require('jwt-decode');
const mobilixClient = require('@allbin/mobilix-api-client');
const dotenv = require('dotenv').config();


const client = mobilixClient.MobilixApiClient({
  baseUrl: 'https://api.mobilix.dev.allbin.se',
  token: () => getTokenPromise(),
})

const CLIENT_ID = dotenv.parsed.CLIENT_ID;
const CLIENT_SECRET = dotenv.parsed.CLIENT_SECRET;
var expDate = new Date(0);
var token;


const data = JSON.stringify({
  "audience": "https://api.mobilix.dev.allbin.se",
  "grant_type": "client_credentials",
  "client_id": CLIENT_ID,
  "client_secret": CLIENT_SECRET
});


var config = {
  method: 'post',
  url: 'https://allbin.eu.auth0.com/oauth/token',
  headers: {
    'Content-Type': 'application/json'
  },
  data: data
};


async function getTokenPromise() {
  // if we still have a valid token don't fetch a new one.
  if (Date.now() >= expDate.getTime()) {
    try {
      const res = await axios(config, data);
      token = res.data.access_token;
      var decodedToken = jwt_decode(token);
      var exp = decodedToken.exp;
      expDate = new Date(exp * 1000);
      console.log("Token is not valid, returning new JTW token.");
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

async function testMobilixClient() {
  // const entityTypes = await client.entityTypes.list();
  // const userList = await client.users.list();
  const workorders = await client.workOrders.listEvents();
  // console.log(userList.entries);
  console.log(workorders);
}
testMobilixClient();
// async function testTokenPromise() {
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
//   await getTokenPromise();
// }
// testTokenPromise();




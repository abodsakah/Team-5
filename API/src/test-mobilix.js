'use strict'
//
// CLI for testing mobilix and getting some info
//

var mobilix = require('./mobilixApiClient');
const prompt = require('prompt-sync')();

async function testMobilix() {
    var companyId = prompt('Which company id do you want to so WorkOrders for? ')
    console.log('WorkOrders:\n');
    console.log(await mobilix.getCompanyWorkOrders(parseInt(companyId)));
}

testMobilix();


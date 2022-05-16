'use strict'
//
// CLI for testing mobilix and getting some info
//

var mobilix = require('./mobilixApiClient');
const prompt = require('prompt-sync')();

async function testMobilix() {
    var workOrders = [];
    var companyId = prompt('Which company id do you want to see WorkOrders for: ');
    console.log('WorkOrders:\n');
    workOrders = await mobilix.getCompanyWorkOrders(companyId);
    console.log(workOrders);
    console.log(workOrders.length);

    if (workOrders.length > 0) {
        var res = prompt('type DELETE if you want to delete all WorkOrders: ');
        if (res === 'DELETE') {
            await mobilix.deleteAllWorkOrders();
            console.log('All WorkOrders have been deleted!!!');
        }
    }
}

testMobilix();


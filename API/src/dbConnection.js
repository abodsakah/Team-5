"use strict"

const {Sequelize, QueryTypes} = require('sequelize');
const dotenv = require('dotenv').config({ path:  __dirname + '/../../.env' });

console.log(dotenv)

// init db
const db = new Sequelize(dotenv.parsed.DB_NAME, dotenv.parsed.DB_LOGIN, dotenv.parsed.DB_PASSWORD, {
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql',
});

/**
 * 
 * @param {*} key The API key to be used to get the users information
 * @returns 
 */
async function getApiKeys(key) {
    const result = await db.query("SELECT * FROM `api_keys` WHERE `key` = ?", {type: QueryTypes.SELECT, replacements: [key]})
    return result;
}

async function validateAPIKey(key) {
    let keys = await getApiKeys(key);
    if (keys.length > 0) {
        return true;
    }
    return false;
}

async function getUserById(id) {
    const result = await db.query("SELECT * FROM `users` WHERE `user_id` = ?", {type: QueryTypes.SELECT, replacements: [id]});
    return result;
}

module.exports = {
    getApiKeys,
    validateAPIKey,
    getUserById,
}

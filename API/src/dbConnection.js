"use strict"

const {Sequelize, QueryTypes} = require('sequelize');
const dotenv = require('dotenv').config({ path:  __dirname + '/../../.env' });


// init db
const db = new Sequelize(dotenv.parsed.DB_NAME, dotenv.parsed.DB_LOGIN, dotenv.parsed.DB_PASSWORD, {
    host: dotenv.parsed.DB_HOST,
    dialect: 'mysql',
});

/**
 *
 * @param {*} key The API key to be used to get the users information
 * @returns Gets the API key that matches the specified key
 */
async function getApiKeys(key) {
    const result = await db.query("SELECT * FROM `api_keys` WHERE `key` = ?", {type: QueryTypes.SELECT, replacements: [key]})
    return result;
}

/**
 *
 * @param {*} key The API key to be used to get the users information
 * @returns Returns true if the key is valid, false otherwise
 */
async function validateAPIKey(key) {
    let keys = await getApiKeys(key);
    if (keys.length > 0) {
        return true;
    }
    return false;
}

/**
 *
 * @param {*} id The user id that is to be used to get the users information
 * @returns The user that matches the specified id
 */
async function getUserById(id) {
    const result = await db.query("SELECT * FROM `user_login` WHERE `id` = ?", {type: QueryTypes.SELECT, replacements: [id]});
    return result;
}

async function createUser(email, password, first_name, last_name, nickname, role, company_id) {
    const result = await db.query("INSERT INTO `user_login` (`email`, `password`, `first_name`, `last_name`, `nickname`, `role`, `company_id`) VALUES (?, ?, ?, ?, ?, ?, ?)", {type: QueryTypes.INSERT, replacements: [email, password, first_name, last_name, nickname, role, company_id]});
    return result;
}

module.exports = {
    getApiKeys,
    validateAPIKey,
    getUserById,
    createUser
}


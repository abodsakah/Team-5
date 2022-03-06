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

/**
 * 
 * @param {*} email User email
 * @param {*} password bcrypted password
 * @param {*} first_name User first name
 * @param {*} last_name User last name
 * @param {*} nickname Username
 * @param {*} role 0 = High admin, 1 = Company admin, 2 = User
 * @param {*} company_id The company id that the user belongs to
 * @returns The user id that was created
 */
async function createUser(email, password, first_name, last_name, nickname, role, company_id) {
    const result = await db.query("INSERT INTO `user_login` (`email`, `password`, `first_name`, `last_name`, `nickname`, `role`, `company_id`) VALUES (?, ?, ?, ?, ?, ?, ?)", {type: QueryTypes.INSERT, replacements: [email, password, first_name, last_name, nickname, role, company_id]});
    return result;
}

/**
 * 
 * @param {*} name Company name
 * @param {*} email Support mail
 * @param {*} phone Support phone
 * @returns 
 */
async function createCompany(name, email, phone) {
    const result = await db.query("INSERT INTO `companies` (`name`, `support_email`, `support_phone`) VALUES (?, ?, ?)", {type: QueryTypes.INSERT, replacements: [name, email, phone]});
    return result;
}

/**
 * 
 * @returns All the nodes in the preloaded databases
 */
async function getPreloadedNodes() {
    const result = await db.query("SELECT * FROM `node_preloaded`", {type: QueryTypes.SELECT});
    return result;
}

/**
 * 
 * @returns All companies
 */
async function getCompanies() {
    const result = await db.query("SELECT * FROM `companies`", {type: QueryTypes.SELECT});
    return result;
}

module.exports = {
    getApiKeys,
    validateAPIKey,
    getUserById,
    createUser,
    createCompany,
    getCompanies,
    getPreloadedNodes
}


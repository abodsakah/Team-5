"use strict"

const {Sequelize, QueryTypes} = require('sequelize');
const dotenv = require('dotenv').config();


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
    logEvent(`User ${result[0]} created`, company_id);
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
    const result = await db.query("CALL create_company(?, ?, ?)", {type: QueryTypes.INSERT, replacements: [name, email, phone]});
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
 * @param {int} deviceId 
 * @param {int} deviceType 
 * @param {int} companyId 
 * @returns {} 
 */
async function addPreloadedNode(deviceId, deviceType, companyId) {
    const result = await db.query("INSERT INTO `node_preloaded` (`uid`, `type`, `company_id`) VALUES (?, ?, ?)", {type: QueryTypes.INSERT, replacements: [deviceId, deviceType, companyId]});
    // logEvent(`Node ${deviceId} added to preloaded_nodes`, companyId);
    return result;
}

/**
 * 
 * @returns All companies
 */
async function getCompanies() {
    const result = await db.query("SELECT * FROM `company_website_settings`", {type: QueryTypes.SELECT});
    return result;
}

/**
 *  Used to add a new logical device to the database
 * @param {*} uid The unique id of the device
 * @param {*} name The display name of the logical device
 * @param {*} is_part_of What asset the device is part of
 * @param {*} type The type of node
 * @param {*} status The status of the device
 * @param {*} companyId The company id the node belongs to
 * @returns the id of the logical device that was created
 */
async function addLogicalDevice(uid, name, is_part_of, type, status, companyId) {
    try{
        // check if a logical_device with the same uid already exists 
        // and delete it if it has status "DELETED"
        var node = await getNodeFromUid(uid);
        if (node.status == "DELETED") {
            // delete logical_device
            console.log("node is deleted, deleting...");
            await db.query("CALL delete_logical_device_from_uid(?)",
                {type: QueryTypes.DELETE, replacements: [uid]});
        }
    }
    catch (err) {
        console.log(err);
    }

    // add logical_device
    const result = await db.query("CALL add_node_no_trigger_action(?, ?, ?, ?, ?)",
        {type: QueryTypes.INSERT, replacements: [uid, name, is_part_of, type, status]});
    logEvent(`Sensor ${name} added`, companyId);
    return result;
}

/**
 * 
 * @param {*} companyId The id of the company
 * @returns A JSON object with the companies color, logo, id and company name
 */
async function getCompanySetting(companyId) {
    const result = await db.query("CALL get_company_settings(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result;
}

/**
 * 
 * @param {*} nodeId The id of the device
 * @param {*} companyId The id of the company that owns the device
 * @returns all info for the node
 */
async function getNodeInfo(nodeId, companyId) {
    // TODO: fix this function and sql procedure to also take company_id, (view exists that has company_id already)
    const result = await db.query("CALL get_logical_device_all(?,?)", {type: QueryTypes.SELECT, replacements: [nodeId, companyId]});
    return result[0][0];
}

/**
 * 
 * @param {*} uid  The UID of the device
 * @param {*} companyId comapny that owns the node
 * @returns all info for the node
 */
function getPreloadedNode(uid, companyId) {
    return db.query("CALL get_preloaded_node(?,?)", {type: QueryTypes.SELECT, replacements: [uid, companyId]});
}

/**
 * 
 * @param {*} companyId The company id to fetch log from
 * @returns Log for specified company
 */
async function getCompanyLog(companyId) {
    // TODO: fix this function and sql procedure to also take company_id, (view exists that has company_id already)
    const result = await db.query("CALL get_company_log(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result[0];
}

/**
 * 
 * @param {*} uid The unique id of the node
 * @returns The status of the node
 */
async function getNodeFromUid(uid) {
    // TODO: fix this function and sql procedure to also take company_id, (view exists that has company_id already)
    const result = await db.query("CALL get_node_from_uid(?)", {type: QueryTypes.SELECT, replacements: [uid]});
    return result[0][0];
}

/**
 * 
 * @param {*} nodeId The id of the device
 * @param {*} companyId The id of the company that owns the device
 * @returns The type id of the node
 */
async function getNodeType(nodeId, companyId) {
    const result = await db.query("CALL get_logical_device_type(?,?)", {type: QueryTypes.SELECT, replacements: [nodeId, companyId]});
    return result[0][0];
}

/**
 * 
 * @param {*} nodeId The id of the device
 * @param {*} companyId The id of the company that owns the device
 * @returns The status of the node
 */
async function getNodeStatus(nodeId, companyId) {
    const result = await db.query("CALL get_logical_device_status(?,?)", {type: QueryTypes.SELECT, replacements: [nodeId, companyId]});
    return result[0][0];
}

/**
 * Sets node status to "TBD"
 * @param {*} nodeId The node id of the device
 * @param {*} companyId The id of the company that owns the device
 */
async function setNodeToBeDeleted(nodeId, companyId) {
    const result = await db.query("CALL set_device_to_be_deleted(?,?)", {type: QueryTypes.UPDATE, replacements: [nodeId, companyId]});
    logEvent(`Sensor ${nodeId} set to deleted`, companyId);
    return result;
}

/**
 * Sets node status to "DELETED"
 * @param {*} nodeId The node id of the device
 * @param {*} companyId The id of the company that owns the device
 */
async function setNodeASDeleted(nodeId, companyId) {
    const result = await db.query("CALL set_device_as_deleted(?,?)", {type: QueryTypes.UPDATE, replacements: [nodeId, companyId]});
    logEvent(`Sensor ${nodeId} has been deleted`, companyId);
    return result;
}

/**
 * Sets node status to "REPORTED"
 * @param {*} nodeId The node id of the device
 * @param {*} companyId The id of the company that owns the device
 */
 async function setNodeAsReported(nodeId, companyId) {
    const result = await db.query("CALL set_device_as_reported(?,?)", {type: QueryTypes.UPDATE, replacements: [nodeId, companyId]});
    logEvent(`Sensor ${nodeId} set to reported`, companyId);
    return result;
}

/**
 * Sets node status to "ACTIVE"
 * @param {*} nodeId The node id of the device
 * @param {*} companyId The id of the company that owns the device
 */
 async function setNodeAsActive(nodeId, companyId) {
    const result = await db.query("CALL set_device_as_active(?,?)", {type: QueryTypes.UPDATE, replacements: [nodeId, companyId]});
    // logEvent(`Node ${nodeId} set to active`, companyId);
    return result;
}

/**
 * 
 * @param {*} companyId The id of the company which to find users for 
 * @returns a object with all users
 */
async function getUsersForCompany(companyId) {
    const result = await db.query("CALL get_users_for_company(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result[0];
}

/**
 * 
 * @param {*} companyId 
 * @returns A list with all the logical devices for a company that have status "REPORTED"
 */
async function getReportedLogicalDeviceForCompany(companyId) {
    const result = await db.query("CALL reported_logical_devices_for_company(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result[0];
}

/**
 * 
 * @param {*} companyId 
 * @returns A list with all the logical devices for a company
 */
async function getLogicalDeviceForCompany(companyId) {
    const result = await db.query("CALL logical_devices_for_company(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result[0];
}

/**
 * 
 * @param {*} sensorType 
 * @param {*} companyId 
 * @returns A json object with the amount
 */
async function getAmountOfSensorTypes(sensorType, companyId) {
    const result = await db.query("CALL get_amount_type_of_sensor(?, ?)", {type: QueryTypes.SELECT, replacements: [sensorType, companyId]});
    return result[0][0];
}
    
/**
 * Gets all the building, finds all spaces with a NULL as "is_part_of"
 * @param {*} companyId The company id for the space
 * @returns A list with all the spaces available for a company
 */
async function getBuildingsForCompany(companyId) {
    const result = await db.query("CALL get_all_buildings(?)", {type: QueryTypes.SELECT, replacements: [companyId]});
    return result[0];
}

/**
 * Gets all the spaces that has the "is_part_of" set to the space_id
 * @param {*} space_id the space id for the space
 * @returns A list with all the spaces available for a company
 */
async function getSpacesForBuilding(space_id) {
    const result = await db.query("CALL get_spaces_for_building(?)", {type: QueryTypes.SELECT, replacements: [space_id]});
    return result[0];
}

/**
 * Gets one space from it's id
 * @param {*} space_id the space id for the space
 * @returns the desired space
 */
 async function getSpaceFromId(space_id) {
    const result = await db.query("CALL get_space_from_id(?)", {type: QueryTypes.SELECT, replacements: [space_id]});
    return result[0][0];
}


/**
 * 
 * @param {*} id The company id
 * @returns the name, support_email, support_phone, color and logo of the company
 */
async function getCompany(id) {
    const result = await db.query("SELECT * FROM company_website_settings WHERE id = ?", {type: QueryTypes.SELECT, replacements: [id]});
    return result[0];
}

/**
 * 
 * @param {*} id The id of the company to be updated
 * @param {*} name The new name of the company
 * @param {*} email The new email of the company
 * @param {*} phone The new phone of the company
 * @param {*} color The new color of the company
 * @param {*} logo The new logo of the company
 * @returns 
 */
async function updateCompanyInfo(id, name, email, phone, color, logo) {
    const result = await db.query("CALL update_company_info(?, ?, ?, ?, ?, ?)", {type: QueryTypes.UPDATE, replacements: [id, name, email, phone, color, logo]});
    logEvent(`Company information and/or styling updated`, id);
    return result;
}

/**
 * 
 * @param {*} space_id The space id where the assets are in
 * @returns a list of the assets in the space
 */
async function getAssetsInSpace(space_id) {
    const result = await db.query("CALL get_assets_in_space(?)", {type: QueryTypes.SELECT, replacements: [space_id]});
    return result[0];
}   

/**
 * 
 * @param {*} nodeId, the logical_device id that the asset hosts
 * @returns specified asset
 */
 async function getAssetFromNodeId(nodeId) {
    const result = await db.query("CALL get_asset_from_logical_device_id(?)", {type: QueryTypes.SELECT, replacements: [nodeId]});
    return result[0][0];
}   

/**
 * 
 * @param {*} action What action has to happen for a threshold to be triggered t.ex. UP, DOWN, BETWEEN
 * @param {*} threshold should be a number that is the threshold
 * @returns the id of the created threshold
 */
async function createThreshold(action, threshold) {
    const result = await db.query("CALL create_threshold(?, ?)", {type: QueryTypes.INSERT, replacements: [action, threshold]});
    return result[0];
}

/**
 * 
 * @param {*} deviceUid The unique id of the device
 * @param {*} thresholdId The id of the threshold
 * @returns 
 */
async function updateLogicalDeviceWithThreshold(deviceUid, thresholdId) {
    const result = await db.query("CALL update_logical_device_threshold(?, ?)", {type: QueryTypes.UPDATE, replacements: [deviceUid, thresholdId]});
    logEvent(`Sensor ${deviceUid} setup is finished`, deviceUid);
    return result;
}

/**
 * 
 * @param {*} thresholdId threshold id we wanna grab
 * @returns a nodes threshold values
 */
 async function getThreshold(thresholdId) {
    const result = await db.query("CALL get_threshold(?)", {type: QueryTypes.SELECT, replacements: [thresholdId]});
    return result[0][0];
 }

/**
 * 
 * @param {*} nodeId node that has that threshold
 * @returns a nodes threshold values
 */
async function getThresholdForNode(nodeId, companyid) {
    const node = await getNodeInfo(nodeId, companyid);
    const result = await db.query("CALL get_threshold(?)", {type: QueryTypes.SELECT, replacements: [node.trigger_action]});
    return result[0][0];
}

/**
 * 
 * @param {*} type The type string of the sensor 
 * @param {*} companyId The company that owns the sensor
 * @returns A list of all sensors
 */
async function getNodesOfType(type, companyId) {
    const result = await db.query("CALL get_nodes_for_type(?, ?)", {type: QueryTypes.SELECT, replacements: [companyId, type]});
    return result[0];
}

async function addStyling(comp_id, color, logo) {
    const result = await db.query("CALL add_styling(?, ?, ?)", {type: QueryTypes.INSERT, replacements: [comp_id, color, logo]});
    return result;
}

/**
 * Report event to log
 * @param {*} logMsg The message to be logged
 * @param {*} companyId The company id this message is for
 */
async function logEvent(logMsg, companyId) {
    const result = await db.query("CALL add_to_log(?, ?)", {type: QueryTypes.INSERT, replacements: [logMsg, companyId]});
    return result;
}

/**
 * Updated the node threshold
 * @param {*} nodeId The id of the threshold
 * @param {*} action The action to when it should be triggered
 * @param {*} value the value that should be triggered
 * @returns 
 */
async function updateThreshold(nodeId, action, value, companyId) {
    let node = await getNodeInfo(nodeId, companyId);
    const result = await db.query("CALL update_threshold(?, ?, ?)", {type: QueryTypes.UPDATE, replacements: [node.trigger_action, action, value]});
    logEvent(`Threshold of sensor ${nodeId} has been updated`, companyId);
    return result;
}

/**
 * 
 * @param {*} typeName The name of the node
 * @param {*} appSetting The application setting of the node
 */
async function createNodeType(typeName, appSetting, typeNumber) {
    let result = await db.query("INSERT INTO `node_types` (`name`, `app_settings`) VALUES (?, ?, ?); ", {type: QueryTypes.INSERT, replacements: [typeName, appSetting]});
    return result;
}

/**
 * 
 * @returns all node types
 */
async function getNodeTypes() {
    let result = await db.query("SELECT * FROM `node_types`", {type: QueryTypes.SELECT});
    return result;
}

module.exports = {
    getApiKeys,
    validateAPIKey,
    getUserById,
    createUser,
    createCompany,
    getCompanies,
    getPreloadedNodes,
    addPreloadedNode,
    addLogicalDevice,
    getCompanySetting,
    setNodeASDeleted,
    setNodeAsReported,
    setNodeAsActive,
    setNodeToBeDeleted,
    getNodeStatus,
    getNodeType,
    getUsersForCompany,
    getCompanyLog,
    getLogicalDeviceForCompany,
    getReportedLogicalDeviceForCompany,
    getAmountOfSensorTypes,
    getNodeInfo,
    getNodeFromUid,
    getBuildingsForCompany,
    getSpacesForBuilding,
    getSpaceFromId,
    getAssetsInSpace,
    getAssetFromNodeId,
    getPreloadedNode,
    createThreshold,
    updateLogicalDeviceWithThreshold,
    getThreshold,
    getNodesOfType,
    addStyling,
    getCompany,
    updateCompanyInfo,
    logEvent,
    updateThreshold,
    getThresholdForNode,
    createNodeType,
    getNodeTypes
}


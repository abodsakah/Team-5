/**
 * SAMPLE
 * 
     const [lang] = {
        loading: "",
        login: "",
        welcome: "",
        userId: "",
        addSensor: "",
        add: "",
        mostRecent: "",
        sensor: "",
        articleNumber: "",
        date: "",
        time: "",
        amount: "",
        dashboard: "",
        device: "",
        devices: "",
        user: "",
        users: "",
        profile: "",
        logout: "",
        admin: ""
     }
 * 
 * 
 */

const en = {
    loading: "Loading",
    login: "Login",
    welcome: "Welcome",
    userId: "User id",
    addSensor: "Add sensor",
    add: "Add",
    mostRecent: "Most recent",
    sensor: "Sensor",
    articleNumber: "Article number",
    date: "Date",
    time: "Time",
    amount: "Amount",
    dashboard: "Dashboard",
    device: "Device",
    devices: "Devices",
    user: "User",
    users: "Users",
    profile: "Profile",
    logout: "Logout",
    admin: "Admin",
    rules: "Rules",
}

const se = {
    loading: "Laddar",
    login: "Logga in",
    welcome: "Välkommen",
    userId: "Användar-ID",
    addSensor: "Lägg till",
    add: "Lägg till",
    mostRecent: "Senaste",
    sensor: "Sensor",
    articleNumber: "Artikelnummer",
    date: "Datum",
    time: "Tid",
    amount: "Antal",
    dashboard: "Dashboard",
    device: "Enhet",
    devices: "Enheter",
    user: "Användare",
    users: "Användare",
    profile: "Profil",
    logout: "Logga ut",
    admin: "Admin",
    rules: "Regler",
}

let language = en;

function setLang(lang) { // gets the language code and sets the language
    switch (lang) {
        case "en":
            language = en;
            break;
        case "se":
            language = se;
            break;
        default:
            language = en;
            break;
    }
}


/**
 * 
 * @param {*} string the string to be translated
 * @returns the translated string
 */
function t(string) { 
    return language[string];
}

module.exports = {
    setLang,
    t
}
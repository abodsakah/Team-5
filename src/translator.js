

let language = getLanguageFile("en"); // the language json

/**
 * 
 * @param {*} language The code of the language to be loaded
 * @returns the language json from the file
 */
function getLanguageFile(language) {
    return require(`./locales/${language}.json`);
}

/**
 * 
 * @param {*} lang the language code
 */
function setLang(lang) { // gets the language code and sets the language
    switch (lang) {
        case "en":
        case "en-US":
        case "en-GB":
            language = getLanguageFile("en");
            break;
        case "sv":
        case "sv-SE":
            language = getLanguageFile("sv");
            break;
        default:
            language = getLanguageFile("en");
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
    getLanguageFile,
    t
}
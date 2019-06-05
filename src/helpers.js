const fs = require('fs'); 

module.exports = {
    name: 'helpers',
    description: 'Collection of helper functions and properties',

    // Load or reload configuration values
    loadConfig() {
        this.config = JSON.parse(fs.readFileSync('./config.json'));
    },

    // HELP!
    help() {

    },

    // Print one element of a one-dimesional array per line
    onePerLine(array) {
        let str = '';
    
        array.forEach((element) => {
            str += '\t' + element + "\n";
        });

        return str;
    },

    // Print one key=>element pair of an associative object per line
    jsonObjOnePerLine(jsonObj) {
        let str = '';

        for(let key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                str += key + ': ' + jsonObj[key] + "\n";
            }
        }

        return str;
    },

    // Check if the user is an admin of the current server
    isAdmin(message) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            return true;
        }

        if (message.member.roles.has('199588562411192320')) {
            return true;
        }

        return false;
    },

    // Possible configuration indices
    possibleConfigKeys: [
        'maxRam',
        'minRam',
        'restartOnError',
    ],

    // Possible configration actions
    possibleActions: [
        'set',
        'get',
        'remove',
        'reset',
        'backups',
        'backup'
    ],

    // Allowed configuration values
    allowedValues: {
        'maxRam': ['xG'],
        'minRam': ['xG'],
        'prefix': ['any single character']
    },

    // Available sub commands, this is populated on initialization
    availableSubcommands: [],

    // Runtime Configuration, loaded on demand
    config: '',
}
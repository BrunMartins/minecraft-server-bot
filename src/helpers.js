module.exports = {
    name: 'helpers',
    help() {

    },
    onePerLine(array) {
        let str = '';
    
        array.forEach((element) => {
            str += '\t' + element + "\n";
        });

        return str;
    },
    jsonObjOnePerLine(jsonObj) {
        let str = '';

        for(let key in jsonObj) {
            if (jsonObj.hasOwnProperty(key)) {
                str += key + ': ' + jsonObj[key] + "\n";
            }
        }

        return str;
    },
    isAdmin(message) {
        if (message.member.hasPermission("ADMINISTRATOR")) {
            return true;
        }

        if (message.member.roles.has('199588562411192320')) {
            return true;
        }

        return false;
    },
    possibleConfigKeys: [
        'maxRam',
        'minRam',
        'restartOnError',
    ],
    possibleActions: [
        'set',
        'get',
        'remove',
        'reset',
        'backups',
        'backup'
    ],
    allowedValues: {
        'maxRam': ['xG'],
        'minRam': ['xG'],
        'restartOnError': [true, false]
    },
    availableSubcommands: [
        'ping',
        'config',
        'start',
        
    ]
}
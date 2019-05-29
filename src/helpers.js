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
    possibleConfigKeys: [
        'maxRam',
        'minRam',
        'restartOnError',
    ],
    possibleActions: [
        'set',
        'get',
        'remove',
        'reset'
    ],
    allowedValues: {
        'maxRam': ['xG'],
        'minRam': ['xG'],
        'restartOnError': [true, false]
    }
}
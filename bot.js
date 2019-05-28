const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');
const prefix = '!';



const possibleConfigKeys = [
    'maxRam',
    'minRam',
    'restartOnError',
]; 

const possibleActions = [
    'set',
    'get',
    'remove',
    'reset'
]

const allowedValues = {
    'maxRam': ['xG'],
    'minRam': ['xG'],
    'restartOnError': [true, false]
};

const printHelpMessage = () => {

}

const onePerLine = (array = []) => {
    let str = '';
    
    array.forEach((element) => {
        str += '\t' + element + "\n";
    });

    return str;
}

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
// Initialize Discord Bot
var bot = new Discord.Client({
   token: auth.token,
   autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', (user, userID, channelID, message, evt) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (!message.startsWith(prefix) && user === 'Minecraft Server') return;
    
    var args = message.substring(prefix.length).split(' ');
    var cmd = args[0];

    args = args.splice(1);
    switch(cmd) {
        // !ping
        case 'start':
            bot.sendMessage({
                to: channelID,
                message: 'Pong!'
            });
        
        case 'config':
            const action = args[0];
            const key = args[1];
            const value = args[2];

            if (action !== 'reset' && (!key || !value || !action || possibleActions.indexOf(action) === -1 || possibleConfigKeys.indexOf(key) === -1)) {
                let actions = onePerLine(possibleActions);
                bot.sendMessage({
                    to: channelID,
                    message: "Command usage:\n!config <action> <key> <value>\nActions:\n" + actions + "\n"
                });
            }

            switch(action) {
                case 'set':
                    if(key === 'maxRam') {
                        if (value.match(/[1-9][Gg]/)) {
                            fs.readFile('./config.json', (err, json) => {
                                console.log('heeeeeres johnny');
                                if (err) return;
                            
                                try {
                                    config = JSON.parse(json);
                                    config.maxRam = value;
                                    console.log("Saving config")
                                    fs.truncateSync('./config.json', 0);
                                    fs.writeFile('./config.json', JSON.stringify(config), (err) => {
                                        if (err) {
                                            console.error(err);
                                            return;
                                        }

                                        console.log('Saved Config');
                                    });
                                } catch (err) {
                                    console.log(err);
                                    return;
                                }
                            });

                            
                        }
                    }
                case 'reset':
                    let defaults;
                    fs.readFile('./defaults.json', (err, defaults) => {
                        if (err) {
                          console.log(err); 
                          return;  
                        } 

                        fs.writeFile('./config.json', defaults, (err) => {
                            if (err) {
                                console.log(err); 
                                return;
                            } 
                        })
                    });
            }

        default:
            printHelpMessage();
        break;
        // Just add any case commands if you want to..
        }
     
});
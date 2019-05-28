const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');
const fs = require('fs');
let config = require('./config.json');
const prefix = '!';

const possibleConfigKeys = 

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
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`

    if (!message.content.startsWith(prefix) && message.author.bot) return;

    console.log('Here1');
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

        break;
        // Just add any case commands if you want to..
        }
     
});
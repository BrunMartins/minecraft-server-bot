const Discord = require('discord.js');
const auth = require('./auth.json');
const logger = require('winston');
const fs = require('fs');
const helpers = require('./src/helpers.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();


logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

// Initialize client
client.once('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');

    // Get all the commands present in the commands folder
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    // Iterate all the filenames and assign the commands in the client object
    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
    }
    
    // Check if it's the first time the bot is being executed and create the local configuration file
    if (!fs.existsSync('./config.json')) {
        client.commands.get('mcsrv').createLocalConfig();
    }

    // Get a list of sub commands available in the client object
    for(const subCommand in client.commands.get('mcsrv').commands){
        helpers.availableSubcommands.push(subCommand);
    }

    helpers.loadConfig();
});
client.login(auth.token);



client.on('message', message => {
    // If the message doesn't include the prefix, ignore it.
    if (!message.content.startsWith(helpers.config.prefix) || message.author.bot) return;

    // else parse it's arguments
    // Remove the prefix off the begining of the string and split the arguments by spaces
    const args = message.content.slice(helpers.config.prefix.length).split(/ +/);

    // Get the main command and remove it from the arguments array
    const cmd = args.shift().toLowerCase();
    
    // If the command comes in empty, notify the user
    if (typeof cmd === 'undefined' || cmd === '') {
        message.channel.send('You must specify a command after the ' + helpers.config.prefix);
        return;
    }

    // Check for the presence of a subcommand, if there is one, repeat the above procedure
    let subCmd;
    if(args.length > 0) {
        subCmd = args.shift().toLowerCase().trim();
    }

    // If the sub command comes in empty, notify the user
    if (typeof subCmd === 'undefined' || subCmd === '') {
        const embed =new Discord.RichEmbed().setColor('#FF0000').addField('You must specify a sub command.\nHere\'s a list of available sub commands:', helpers.onePerLine(helpers.availableSubcommands));
        message.channel.send({embed: embed});
        return;
    }
    
    // Load the command file from the client object
    const foundCmd = client.commands.get(cmd);

    // If the found command is null it mean the command in the message doesn't exist, notify the user
    if (!foundCmd) {
        message.channel.send('Command "' + cmd + '" not found.');
        return;
    }

    // This statement check if the found command object has the sub command property. 
    // If it doesn't, that means the sub command in the message doesn't exist, notify the user
    if  (!foundCmd.commands.hasOwnProperty(subCmd)) {
        const embed = new Discord.RichEmbed().setColor('#FF0000').addField('Sub command "' + subCmd + '" doesn\'t exist.\nHere\'s a list of available sub commands:', helpers.onePerLine(helpers.availableSubcommands));
        message.channel.send({embed: embed});
        return;
    }


    // After clearing all the checks, log and run the subcommand.
    fs.appendFileSync('./command.log', new Date() + ' - ' + message.author.username + ' executed "' + foundCmd.name + ' ' + subCmd + '"\n');
    foundCmd.commands[subCmd](message, args, client);
});

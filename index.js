const Discord = require('discord.js');
const auth = require('./auth.json');
const logger = require('winston');
let {prefix} = require('./config.json')
const fs = require('fs');
const helpers = require('./src/helpers.js');

const client = new Discord.Client();
client.commands = new Discord.Collection();


logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

function updateConfig() {
    fs.readFile('./config.json', (err, config) => {
        try {
            config = JSON.parse(config);
            prefix = config.prefix;
        } catch (error) {
            
        }
        
    });
}

logger.level = 'debug';

//Initialize client
client.once('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(client.user.username + ' - (' + client.user.id + ')');
    const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

    t = setInterval(() => {
        if(client.uptime);
    }, 300000)

    for (const file of commandFiles) {
        const command = require(`./src/commands/${file}`);
        client.commands.set(command.name, command);
    }

    for(const subCommand in client.commands.get('mcsrv').commands){
        helpers.availableSubcommands.push(subCommand);
    }
    
});
client.login(auth.token);



client.on('message', message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const subCmd = args.shift().toLowerCase().trim();
    if (typeof cmd === 'undefined' || cmd === '') {
        message.channel.send('You must specify a command after the ' + prefix);
        return;
    }
    const foundCmd = client.commands.get(cmd) //|| client.commands.find(cmnd => cmnd.aliases && cmnd.aliases.includes(cmd));

    if (!foundCmd) {
        message.channel.send('Command "' + cmd + '" not found.');
        return;
    }

    if  (!foundCmd.commands.hasOwnProperty(subCmd)) {
        const embed = new Discord.RichEmbed().setColor('#FF0000').addField('Sub command "' + subCmd + '" doesn\'t exist.\nHere\'s a list of available sub commands:', helpers.onePerLine(helpers.availableSubcommands));
        message.channel.send({embed: embed});
        return;
    }

    foundCmd.commands[subCmd](message, args, client);
    t = setTimeout(() => {
        updateConfig();
    }, 2000);
});

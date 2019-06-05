const Discord = require('discord.js');
const auth = require('./auth.json');
const logger = require('winston');
let {prefix} = require('./config.json')
const fs = require('fs');

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
    
});
client.login(auth.token);



client.on('message', message => {
    console.log(prefix)

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    console.log(args);
    let cmd = args.shift().toLowerCase();
    console.log('Command: ', cmd);
    cmd = client.commands.get(cmd) //|| client.commands.find(cmnd => cmnd.aliases && cmnd.aliases.includes(cmd));
    if (!cmd) {
        message.channel.send('Command ' + cmd + ' not found');
        return;
    }
    cmd.execute(message, args, client);
    t = setTimeout(() => {
        updateConfig();
    }, 2000);
});

const fs = require('fs');
const Discord = require('discord.js');
const helpers = require('../helpers.js');

module.exports = {
    name: 'mcsrv',
    commands:{

        ping: (message, args, client) => {
            message.channel.send('Pong!');
        },

        config: (message, args, client) => {

            const { botCentral, prefix } = require('../../config.json');
            let username = message.author.username;
            
            if(message.member.nickname !== null) {
                username = message.member.nickname;
            }
            // Check if message author is administrator or moderator of the server
            if(!helpers.isAdmin(message)) {
                message.channel.send(':octagonal_sign: You are not an administrator and as such, can\'t change any of the configurations.');
                return;
            }

            // Now we're going to choose the action to execute
            switch(args[0]) {
                case 'reset': 
                    // Read the defaults json file
                    fs.readFile('./defaults.json', (err, defaults) => {

                        // Check
                        if (err) {
                            message.channel.send('There was an error, please contact the bot administrator.');
                            channel = client.channels.find(c => c.id === botCentral);
                            channel.send(JSON.stringify(err));
                            return;
                        } 
            
                        // Rewrite configs to defaults
                        fs.writeFile('./config.json', defaults, (err) => {
                            // Check
                            if (err) {
                                message.channel.send('There was an error, please contact the bot administrator.');
                                channel = client.channels.find(c => c.id === botCentral);
                                channel.send(JSON.stringify(err));
                                return;
                            } 

                            message.channel.send('Successfully reset bot configurations.');
                        });
                    });
                    break;

                case 'backup':

                    if (args[1] === 'delete') {
                        if(args[2]) {
                            file = './bak/config.json-' + args[2] + '.bak';
                        } else {
                            message.channel.send('You must provide a backup ID when deleting a backup file.');
                            return;
                        }

                        if (!fs.existsSync(file)) {
                            message.channel.send('There is no backup with id "' + args[1] + '" there may be a typo in your command');
                            return;
                        }

                        fs.unlink(file, (err) => {
                            // Check
                            if (err) {
                                message.channel.send('There was an error, please contact the bot administrator.');
                                channel = client.channels.find(c => c.id === botCentral);
                                channel.send(JSON.stringify(err));
                                return;
                            } 

                            message.channel.send('The backups file ' + file + ' was deleted successfully');
                        });

                        return;

                    } else {

                    }
                    const backups = fs.readdirSync('./bak').filter(file => file.endsWith('.bak'));
                    fs.copyFileSync('config.json', './bak/config.json-' + (backups.length + 1) + '.bak');
                    break;

                case 'restore':
                    
                    const baks = fs.readdirSync('./bak').filter(file => file.endsWith('.bak'));
                    let file = './bak/' + baks[baks.length-1];
                    if(args[1]) {
                        file = './bak/config.json-' + args[1] + '.bak';
                    }

                    if (baks.length < 1) {
                        message.channel.send('There are no backups yet. Type "!config backup" to backup the current configuration. Or don\'t, it\'s your choice.');
                        return;
                    }

                    if (!fs.existsSync(file)) {
                        message.channel.send('There is no backup with id "' + args[1] + '" there may be a typo in your command');
                        return;
                    }

                    fs.readFile(file, (err, bak) => {
                        // Check
                        if (err) {
                            message.channel.send('There was an error, please contact the bot administrator.');
                            channel = client.channels.find(c => c.id === botCentral);
                            channel.send(JSON.stringify(err));
                            return;
                        } 

                        try {
                            fs.truncate('config.json', (error) => {
                                // Check
                                if (err) {
                                    message.channel.send('There was an error, please contact the bot administrator.');
                                    channel = client.channels.find(c => c.id === botCentral);
                                    channel.send(JSON.stringify(err));
                                    return;
                                }
                                fs.writeFileSync('config.json', bak);
                            });
                        } catch(error2) {
                            message.channel.send('There was an error, please contact the bot administrator.');
                            channel = client.channels.find(c => c.id === botCentral);
                            channel.send(JSON.stringify(err));
                            return;
                        }
                    });
                    break;

                case 'set':
                    if(!args[1] || !args[2]) {
                        message.channel.send(':spy: You are missing some arguments. We can\'t have that now can we?...');
                        return;
                    }
                    if(args[1] === 'maxRam') {
                        if (args[2].match(/(^([5-9]{1})[0-9]{2,3}[Mm]$)|(^([1-9]{1})([0-9]{1})?[Gg]$)/)) {
                            fs.readFile('./config.json', (err, config) => {
                                // Check
                                if (err) {
                                    message.channel.send('There was an error, please contact the bot administrator.');
                                    channel = client.channels.find(c => c.id === botCentral);
                                    channel.send(JSON.stringify(err));
                                    return;
                                }
                                        
                                try {
                                    config = JSON.parse(config);
                                    if (parseInt(args[2]) < parseInt(config.minRam)) {
                                        message.channel.send('The maximum RAM value can\'t be lower than the minimumu RAM value, which currently sits at ' + config.minRam);
                                        return;
                                    }
                                    config.maxRam = args[2];
                                    fs.truncate('./config.json', (err) => {
                                        // Check
                                        if (err) {
                                            message.channel.send('There was an error, please contact the bot administrator.');
                                            channel = client.channels.find(c => c.id === botCentral);
                                            channel.send(JSON.stringify(err));
                                            return;
                                        }
                                        fs.writeFileSync('./config.json', JSON.stringify(config));
                                    }) 
                                } catch (error) {
                                    message.channel.send('There was an error, please contact the bot administrator.');
                                    channel = client.channels.find(c => c.id === botCentral);
                                    channel.send(JSON.stringify(err));
                                    return;
                                }  
                            });
                        }
                    } else if(args[1] === 'minRam') {
                        if (args[2].match(/(^([5-9]{1})[0-9]{2,3}[Mm]$)|(^([1-9]{1})([0-9]{1})?[Gg]$)/)) {
                            fs.readFile('./config.json', (err, config) => {
                                // Check
                                if (err) {
                                    message.channel.send('There was an error, please contact the bot administrator.');
                                    channel = client.channels.find(c => c.id === botCentral);
                                    channel.send(JSON.stringify(err));
                                    return;
                                }
                                
                                try {
                                    config = JSON.parse(config);
                                    if (parseInt(args[2]) > parseInt(config.maxRam)) {
                                        message.channel.send('The minimum RAM value can\'t be higher than the maximumu RAM value, which currently sits at ' + config.maxRam);
                                        return;
                                    }
                                    config.minRam = args[2];
                                    fs.truncate('./config.json', (err) => {
                                        // Check
                                        if (err) {
                                            message.channel.send('There was an error, please contact the bot administrator.');
                                            channel = client.channels.find(c => c.id === botCentral);
                                            channel.send(JSON.stringify(err));
                                            return;
                                        }
                                        fs.writeFileSync('./config.json', JSON.stringify(config));
                                    }) 
                                } catch (error) {
                                    message.channel.send('There was an error, please contact the bot administrator.');
                                    channel = client.channels.find(c => c.id === botCentral);
                                    channel.send(JSON.stringify(err));
                                    return;
                                }  
                            });
                        }
                    } else if(args[1] === 'prefix') {
                        fs.readFile('./config.json', (err, config) => {
                            // Check
                            if (err) {
                                message.channel.send('There was an error, please contact the bot administrator.');
                                channel = client.channels.find(c => c.id === botCentral);
                                channel.send(JSON.stringify(err));
                                return;
                            }
                            
                            try {
                                
                                config = JSON.parse(config);
                                config.prefix = args[2];

                                fs.truncate('./config.json', (err) => {
                                    // Check
                                    if (err) {
                                        message.channel.send('There was an error, please contact the bot administrator.');
                                        channel = client.channels.find(c => c.id === botCentral);
                                        channel.send(JSON.stringify(err));
                                        return;
                                    }
                                    fs.writeFileSync('./config.json', JSON.stringify(config));
                                }) 
                            } catch (error) {
                                message.channel.send('There was an error, please contact the bot administrator.');
                                channel = client.channels.find(c => c.id === botCentral);
                                channel.send(JSON.stringify(err));
                                return; 
                            }  
                        });
                    }
                    message.channel.send('Configuration value ' + args[1] + ' changed successfully to ' + args[2]);
                    
                    break;
                    
                case 'backups':
                    const list = fs.readdirSync('./bak').filter(file => file.endsWith('.bak'));
                    const embed = new Discord.RichEmbed().setTitle('Type "' + prefix + 'mcsrv config restore <ID>" to restore a specific backup.').setColor('#00FF00');
                    const dates = [];

                    if (list.length < 1) {
                        message.channel.send('There are no backups yet. Type "!config backup" to backup the current configuration. Or don\'t, it\'s your choice.');
                        return;
                    }

                    list.forEach((file, index) => {
                        let dt = new Date(fs.statSync('./bak/' + file).ctime).toUTCString();
                        dt = dt.split(/ +/);
                        dt = dt[1] + '-' + dt[2] + '-' + dt[3] + ' @ ' + dt[4];
                        dates.push((index + 1) + ' => ' + dt);
                    });
                    embed.addField('Available configuration backup files:', helpers.onePerLine(dates) + "\nSee footer for more info.")
                    .setFooter('type "' + prefix + 'mcsrv config restore <id>" with any of the represented ID numbers or "' + prefix + 'mcsrv config restore" to restore the latest configuration backup.');

                    message.channel.send({embed: embed});
                    break;

                case 'get':

                    fs.readFile('./config.json', (err, jsonData) => {
                        // Check
                        if (err) {
                            message.channel.send('There was an error, please contact the bot administrator.');
                            channel = client.channels.find(c => c.id === botCentral);
                            channel.send(JSON.stringify(err));
                            return;
                        }

                        jsonData = JSON.parse(jsonData);
                        const infoEmbed = new Discord.RichEmbed().setColor('#00FF00').setTitle('Dear ' + username).addField('The current configuration values are as follows:', helpers.jsonObjOnePerLine(jsonData));   
                        message.channel.send({embed: infoEmbed});
                    });

                    
                    break;

                default:

                    const errorEmbed = new Discord.RichEmbed().setColor('#FF0000');
                    if (args[0] === undefined) {
                        errorEmbed.setTitle('You must specify an action').addField("Please choose from one of the following:", helpers.onePerLine(helpers.possibleActions), '----------------------');   
                    } else {
                        errorEmbed.setTitle('----------------------\nThe action you specified does not exist.').addField("Please choose from one of the following:\n" + helpers.onePerLine(helpers.possibleActions), '----------------------');
                    }
                    message.channel.send({embed: errorEmbed});
                    break;
            }
        },

        start: (message, args, client) => {

        },

        stop: (message, args, client) => {

        },

        restart: (message, args, client) => {

        },

        uptime: (message, args, client) => {

        },

        status: (message, args, client) => {

        },

        createLocalConfig: () => {
            fs.copyFileSync('./defaults.json', './config.json');
        }
    }
}
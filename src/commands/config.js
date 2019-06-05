const fs = require('fs');
const Discord = require('discord.js');
const helpers = require('../helpers.js');
const { botCentral } = require('../../config.json');

module.exports = {
    name: 'config',
    aliases: ['conf', 'configuration'],
    /**
     * 
     * Executes config commands
     * 
     * @param {*} message 
     * @param {Array} args 
     */
    execute(message, args, client = null) {
        
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
                        if (err) {
                            console.log(err); 
                            return;
                        } 

                        message.channel.send('Successfully reset bot configurations.');
                    });
                });
                break;

            case 'backup':
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
                    if (err) {
                        console.log(err);
                        return;
                    }

                    try {
                        fs.truncate('config.json', (error) => {
                            if (error) {
                                console.log(err);
                                return;
                            }
                            fs.writeFileSync('config.json', bak);
                        });
                    } catch(error2) {
                        console.error(err);
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
                            if (err) {
                                console.error(err);
                                return;
                            }
                            
                            try {
                                config = JSON.parse(config);
                                config.maxRam = args[2];
                                fs.truncate('./config.json', (err) => {

                                    fs.writeFile('./config.json', JSON.stringify(config));
                                    console.log('Saved Config');
                                }) 
                            } catch (error) {
                               console.error(error);
                               return; 
                            }  
                        });
                    }
                } else if(args[1] === 'minRam') {
                    if (args[2].match(/(^([5-9]{1})[0-9]{2,3}[Mm]$)|(^([1-9]{1})([0-9]{1})?[Gg]$)/)) {
                        fs.readFile('./config.json', (err, config) => {
                            if (err) {
                                console.error(err);
                                return;
                            }
                            
                            try {
                                config = JSON.parse(config);
                                config.minRam = args[2];
                                fs.truncate('./config.json', (err) => {

                                    fs.writeFile('./config.json', JSON.stringify(config));
                                    console.log('Saved Config');
                                }) 
                            } catch (error) {
                               console.error(error);
                               return; 
                            }  
                        });
                    }
                } else if(args[1] === 'prefix') {
                    fs.readFile('./config.json', (err, config) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        
                        try {
                            
                            config = JSON.parse(config);
                            config.prefix = args[2];

                            fs.truncate('./config.json', (err) => {
                                fs.writeFileSync('./config.json', JSON.stringify(config));
                                console.log('Saved Config');
                            }) 
                        } catch (error) {
                            console.error(error);
                            return; 
                        }  
                    });
                }
                
                break;
                
            case 'backups':
                const list = fs.readdirSync('./bak').filter(file => file.endsWith('.bak'));
                const embed = new Discord.RichEmbed().setTitle('Type "!config restore <ID>" to restore a specific backup.');
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
                .setFooter('type "!config restore <id>" with any of the represented ID numbers or "!config restore" to restore the latest configuration backup.');

                message.channel.send({embed: embed});
                break;

            default:

                const errorEmbed = new Discord.RichEmbed().setColor('#ff0000');
                if (args[0] === undefined) {
                    //errorEmbed.setTitle('You must specify an action').addField("Please choose from one of the following:\n" + helpers.onePerLine(helpers.possibleActions));
                    return;
                    message.channel.send({embed: errorEmbed});
                    
                }
                break;
        }
        
    },
}
// set(key, value) {

// },
// get(key) {

// },
// reload() {
    
// }
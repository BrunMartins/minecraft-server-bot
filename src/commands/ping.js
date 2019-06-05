module.exports = {
    name: 'ping',
    description: 'Responds to Ping with Pong',
    execute(message, args, client) {
        message.channel.send('Pong!');
    }
}
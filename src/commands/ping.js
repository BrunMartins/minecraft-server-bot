module.exports = {
    name: 'ping',
    description: 'Responds to Ping with Pong',
    execute(message, args) {
        message.channel.send('Pong!');
    }
}
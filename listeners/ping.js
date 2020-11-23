module.exports = (bot) => {
    bot.on("ping", function(message) {
        message.channel.send("Pong!");
    })
}
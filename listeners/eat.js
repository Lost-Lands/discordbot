module.exports = (bot) => {
    bot.on("eat", function(message) {
        if (message.channel.id == bot.config.channels.eat) {
            message.channel.send('***eat***');
        } else {
            message.reply(`this isnt <#${bot.config.channels.eat}> 🤨`);
        }
    });
}
module.exports = (bot) => {
    bot.on("eat", function(message) {
        if (message.channel.id == "735692290919628881") {
            message.channel.send('***eat***');
        } else {
            message.reply("this isnt <#735692290919628881> 🤨");
        }
    });
}
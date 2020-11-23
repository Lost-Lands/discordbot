module.exports = (bot) => {
    bot.on("message", (message) => {
        if (message.content.contains("/discord")) {
            message.reply("https://help.lostlands.co/article/link-your-discord")
        }
    });
}
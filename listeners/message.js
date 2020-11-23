module.exports = (bot) => {
    bot.on("message", (message) => {
        if (message.content.indexOf("/discord") > -1) {
            message.reply("https://help.lostlands.co/article/link-your-discord")
        }
    });
}
module.exports = (bot) => {
    bot.on("motd", (message, content) => {
        var motd = content;
        if (!message.member.roles.cache.some((role) => role.id === bot.config.roles.verified_player)) {
            return message.reply("That command requires you to have a linked Minecraft account. To link your account, type `/discord link` in game.");
        } else {
            if (motd.length > 3 && motd.length < 46) { //check if MOTD suggestion is too long
                const motdEmbed = new bot.Embed()
                    .setColor('#0099ff')
                    .setDescription(motd)
                    .setTimestamp()

                if (message.author.avatarURL() !== null) {
                    motdEmbed.setAuthor("MOTD from " + message.author.username, message.author.avatarURL());
                } else {
                    motdEmbed.setAuthor("MOTD from " + message.author.username);
                }

                bot.client.channels.cache.get(bot.config.channels.motd_suggestions).send({
                    embed: motdEmbed
                });
                return message.reply("Submitted MOTD: "+ motd);
            } else {
                return message.reply("MOTD must be between 4 and 45 characters. Your MOTD suggestion was "+motd.length);
            }
        }
    });
}
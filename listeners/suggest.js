module.exports = (bot) => {
    bot.on("suggest", (message, content) => {
        var suggestion = content;
        if (!suggestion) {
            return message.channel.send("Usage: `" + bot.config.prefix + "suggest {suggestion}`");
        } else {
            if (suggestion.length < 2048) {
                const suggestionEmbed = new bot.Embed()
                    .setColor('#0099ff')
                    .setDescription(suggestion)
                    .setTimestamp()
                    .setFooter("Lost Lands (Open)");

                if (message.author.avatarURL() !== null) {
                    suggestionEmbed.setAuthor("Suggestion from " + message.author.username, message.author.avatarURL());
                } else {
                    suggestionEmbed.setAuthor("Suggestion from " + message.author.username);
                }

                bot.client.channels.cache.get(bot.config.channels.suggestions).send({
                    embed: suggestionEmbed
                }).then(embedMessage => {
                    embedMessage.react('✅').then(() => embedMessage.react('❌'));
                });
                message.delete();
                return message.reply("Thanks for your suggestion!")
                    .then(msg => {
                        msg.delete({
                            timeout: 5000
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            } else {
                message.delete();
                return message.reply("That suggestion is too long. Suggestions must be less than 2048 characters.")
                    .then(msg => {
                        msg.delete({
                            timeout: 5000
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        }
    });
}
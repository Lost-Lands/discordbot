module.exports = (bot) => {
    bot.on("inprogress", (message, content) => {
        var args = bot.split(content);
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply("You do not have permission update suggestions");
        } else {
            if (args[0].length < 1) {
                return message.reply("Usage: `"+bot.config.prefix+"inprogress {message ID} {response}`");
            }
            staffresponse = content.slice(8 + args[0].length);
            bot.client.channels.cache.get(bot.config.channels.suggestions).messages.fetch(args[0])
                .then(function(message) {
                    var messageData = JSON.parse(JSON.stringify(message.embeds[0]));
                    const suggestionEmbed = new bot.Embed()
                        .setColor('#0099ff')
                        .setDescription("" + messageData.description + "")
                        .setTimestamp(messageData.createdTimestamp)
                        .setFooter("Lost Lands (In Progress)");
                    if (staffresponse) {
                        console.log("Response: "+staffresponse);
                        suggestionEmbed.addField("Staff Response", staffresponse);
                    }
                    if (messageData.author.icon_url !== null) {
                        suggestionEmbed.setAuthor(messageData.author.name, messageData.author.icon_url);
                    } else {
                        suggestionEmbed.setAuthor(messageData.author.name);
                    }
    
                    message.edit(suggestionEmbed);
                });
            return message.reply("Accepted suggestion.");
        }
    });
}
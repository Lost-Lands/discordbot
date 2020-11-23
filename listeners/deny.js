module.exports = (bot) => {
    bot.on("deny", (message, content) => {
        var args = bot.split(content);
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return message.reply("You do not have permission deny suggestions");
        } else {
            if (args[0].length < 1) {
                return message.reply("Usage: `"+bot.config.prefix+"deny {message ID} {response}`");
            }
            staffresponse = content.slice(args[0].length);
            bot.client.channels.cache.get(bot.config.channels.suggestions).messages.fetch(args[0])
                .then(function(message) {
                    var messageData = JSON.parse(JSON.stringify(message.embeds[0]));
                    const suggestionEmbed = new bot.Embed()
                        .setColor('#E9251A')
                        .setDescription("" + messageData.description + "")
                        .setTimestamp(messageData.createdTimestamp)
                        .setFooter("Lost Lands (Denied)");
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
                    
                }).catch((err) => {
                    console.error(err);
                    return message.channel.send("Could not deny, error: "+err);
                });
                return message.reply("Denied suggestion.");
            
        }
    });
}
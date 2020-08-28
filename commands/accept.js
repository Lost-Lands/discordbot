module.exports = function(args, config, Discord, client, message) {
    if (!message.member.roles.cache.some((role) => role.name === config.admin_role)) {
        return message.reply("You do not have permission accept suggestions");
    } else {


        if (typeof args[0] == 'undefined') {
            return message.reply("Usage: `-accept {message ID} {response}`");
        }

        noPrefix = message.content.slice(config.prefix.length).trim()
        staffresponse = noPrefix.slice(8 + args[0].length);
        client.channels.cache.get(config.suggestion_channel).messages.fetch(args[0])
            .then(function(message) {

                var messageData = JSON.parse(JSON.stringify(message.embeds[0]))
                const suggestionEmbed = new Discord.MessageEmbed()
                    .setColor('#75ed0c')
                    .setDescription("" + messageData.description + "")
                    .setTimestamp(messageData.createdTimestamp)
                    .setFooter("Lost Lands (Accepted)");
                if (staffresponse) {
                    console.log("Response: "+staffresponse)
                    suggestionEmbed.addField("Staff Response", staffresponse)
                }
                if (messageData.author.icon_url !== null) {
                    suggestionEmbed.setAuthor(messageData.author.name, messageData.author.icon_url)
                } else {
                    suggestionEmbed.setAuthor(messageData.author.name)
                }

                message.edit(suggestionEmbed);
            });
        return message.reply("Accepted suggestion.")
    }
}
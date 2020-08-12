module.exports = function(args, config, Discord, client, message) {
    if (!message.member.roles.cache.some((role) => role.name === config.admin_role)) {
        return message.reply("You do not have permission deny suggestions");
    } else {

        if (typeof args[0] == 'undefined') {
            return message.reply("Usage: `-deny {message ID}`");
        }

        client.channels.cache.get(config.suggestion_channel).messages.fetch(args[0])
            .then(function(message) {

                var messageData = JSON.parse(JSON.stringify(message.embeds[0]))
                const suggestionEmbed = new Discord.MessageEmbed()
                    .setColor('#E9251A')
                    .setDescription("" + messageData.description + "")
                    .setTimestamp(messageData.createdTimestamp)
                    .setFooter("Lost Lands (Denied)")
                if (messageData.author.icon_url !== null) {
                    console.log(messageData.author.name);
                    suggestionEmbed.setAuthor(messageData.author.name, messageData.author.icon_url)
                } else {
                    suggestionEmbed.setAuthor(messageData.author.name)
                }

                message.edit(suggestionEmbed);
            });
        return message.reply("Denied suggestion.")
    }
}
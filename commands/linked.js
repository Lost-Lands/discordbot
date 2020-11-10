module.exports = function(config, Discord, message, v1) {
    if (!message.member.roles.cache.some((role) => role.name === config.admin_role)) {
        return;
    } else {
        if (message.mentions.members.first()) {
            var user = message.mentions.members.first().user;
            v1.linked(user.id, function(err, linked) {
                if (err) {
                    if (err.error == "No linked accounts found.") {
                        message.channel.send("That user does not have a linked Minecraft account.");
                    } else {
                        console.error(err);
                        message.channel.send("Error checking for linked account.");
                    }
                } else {
                    if (linked.uuid) {
                        const uuidEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setDescription(linked.uuid)
                        if (user.avatarURL() !== null) {
                            uuidEmbed.setAuthor(`${user.username}'s UUID`, user.avatarURL())
                        } else {
                            uuidEmbed.setAuthor(`${user.username}'s UUID`);
                        }
                        message.channel.send(uuidEmbed);
                    } else {
                        message.channel.send("That user does not have a linked Minecraft account.");
                    }
                    
                }
            });
        } else {
            message.channel.send("Usage: `-linked @{user}`");
        }
    }

}
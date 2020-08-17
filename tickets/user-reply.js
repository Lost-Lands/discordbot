module.exports = function(args, config, Discord, client, message, db) {
    if (message.author.bot) return;
    var dbo = db.db("tickets");
    dbo.collection("active").findOne({userID: message.author.id}, function(err, result) {
        if (err) {
            console.log(err);
            return message.reply("You do not currently have an open ticket to reply to!")
        } else {
            if (message.content > 2048) {
                message.reply('Your message is too long!');
            } else {
                const replyEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setDescription(message.content)
                if (message.author.avatarURL() !== null) {
                    replyEmbed.setAuthor("Reply from " + message.author.username, message.author.avatarURL())
                } else {
                    replyEmbed.setAuthor("Reply from " + message.author.username)
                }
    
                client.channels.cache.get(result.channelID).send(replyEmbed)
            }
        }
    });
}
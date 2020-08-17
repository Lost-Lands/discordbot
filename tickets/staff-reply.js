module.exports = function(Discord, client, message, db) {
    var dbo = db.db("tickets");

    
    dbo.collection("active").findOne({channelID: message.channel.id}, function(err, result) {
        if (err) {
            console.log(err);
            return message.reply("Unable to find a ticket to reply to.")
        } else {
            //Forward client.message
            if (message.content > 2048) {
                message.reply('Your message is too long!');
            } else {
                const replyEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setAuthor('Reply from Staff')
                    .setDescription(message.content)
                client.users.cache.get(result.userID).send(replyEmbed);
            }

        }
    });
}
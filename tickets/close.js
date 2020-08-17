module.exports = function(args, config, Discord, client, message, db) {
    var dbo = db.db("tickets");

    
    dbo.collection("active").findOne({userID: message.author.id}, function(err, result) {
        if (err) {
            console.log(err);
            return message.reply("You do not currently have an open ticket to close.")
        } else {
            var supportChannel = client.guilds.cache.get(config.admin_guild).channels.cache.find(c => c.id === result.channelID)
            
            if (supportChannel) {
                supportChannel.delete();
                dbo.collection("active").deleteOne({userID: message.author.id}, function(err, obj) {
                    if (err) {
                        console.log(err);
                        return message.reply("Failed to close ticket. (Database error)")
                    } else {
                        return message.reply("Ticket closed.")
                    }
                });

                
            }
            else {
                return message.reply("Failed to close ticket.")
            }
        }
    });
}
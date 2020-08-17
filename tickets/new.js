module.exports = function(args, config, Discord, client, message, db) {
    noPrefix = message.content.slice(config.prefix.length).trim()
    subject = noPrefix.slice(3);
    if (!subject) {
        return message.channel.send("Usage: `-new {subject}`");
    } else {
        if (subject.length < 2048) {

            var ticketObject = {
                userID: message.author.id,
                channel: message.author.username+"-"+message.author.discriminator
            }


            client.guilds.cache.get(config.admin_guild).channels.create(ticketObject.channel, {
                type: 'text',
                parent: config.ticketsCategory,
            }).then(function(channel) {

                ticketObject.channelID = channel.id

                var dbo = db.db("tickets");

                dbo.collection("active").insertOne(ticketObject, function(err, res) {
                    if (err) {
                        console.log(err)
                        return message.reply("An error occured while trying to open a new ticket")
                    } else {

                        const ticketCreatedEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setTitle('Ticket Created')
                        .setDescription('**Subject: **'+subject)
                        .addField('**Information**', "We'll contact you as soon as possible here in this direct message with our bot. You may reply here with any additional information.", true)
                        .setTimestamp()
                        .setFooter('Lost Lands Tickets');
                        message.author.send(ticketCreatedEmbed);


                        const ticketSupportEmbed = new Discord.MessageEmbed()
                        .setColor('#0099ff')
                        .setDescription('**Subject: **'+subject)
                        .setTimestamp()
                        .setFooter('Lost Lands Tickets');

                        if (message.author.avatarURL() !== null) {
                            ticketSupportEmbed.setAuthor("Ticket from " + message.author.username, message.author.avatarURL())
                        } else {
                            ticketSupportEmbed.setAuthor("Ticket from " + message.author.username)
                        }

                        channel.send(ticketSupportEmbed);

                        return message.reply("A ticket has been opened for you. Please check your direct messages for more info.")
                        
                    }
                });

            }).catch(function(err) {
                console.log(err);
                return message.reply("An error occured while trying to open a new ticket")
            });

            

            
        } else {
            return message.reply("Subjects cannot be over 2048 characters long.")
        }
    }
}
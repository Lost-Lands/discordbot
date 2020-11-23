module.exports = (bot) => {
    bot.on("invites", (message, content) => {
            if (message.mentions.members.first()) {
                var user = message.mentions.members.first().user
                message.guild.fetchInvites()
                .then(function(i) {
                    var invites = i.filter(invite => invite.inviter !== null && invite.inviter.id === user.id)
                    var totalInvites = 0;
                    invites.forEach((invite) => {
                        totalInvites = totalInvites + invite.uses;
                    });
                    const invitesEmbed = new bot.Embed().setColor('#0099ff');
                    if (invites) {
                        invitesEmbed.setDescription(totalInvites);
                    } else {
                        invitesEmbed.setDescription(0);
                    }
                    if (user.avatarURL() !== null) {
                        invitesEmbed.setAuthor(`${user.username}'s invites`, user.avatarURL())
                    } else {
                        invitesEmbed.setAuthor(`${user.username}'s invites`);
                    }
        
                    message.channel.send(invitesEmbed);
        
                })  
                .catch(console.error);
        } else {
            message.guild.fetchInvites()
            .then(function(i) {
                var invites = i.filter(invite => invite.inviter !== null && invite.inviter.id === message.author.id)
                var totalInvites = 0;
                invites.forEach((invite) => {
                   totalInvites = totalInvites + invite.uses;
                });
                const invitesEmbed = new bot.Embed()
                    .setColor('#0099ff')
                if (message.author.avatarURL() !== null) {
                    invitesEmbed.setAuthor(`${message.author.username}'s invites`, message.author.avatarURL())
                } else {
                    invitesEmbed.setAuthor(`${message.author.username}'s invites`);
                }
                if (invites) {
                    invitesEmbed.setDescription(totalInvites);
                    if (totalInvites >= 5 && !message.member.roles.cache.some((role) => role.name === 'Ambassador')) {
                        //give user role
                        message.member.roles.add(message.guild.roles.cache.find(r => r.name === "Ambassador")).then(function() {
                            message.reply(`🎉 You've received the Ambassador role!`);
                        }).catch(function(err) {
                            console.log(err);
                        });
                    }
    
                } else {
                    invitesEmbed.setDescription(0);
                }
                
    
                message.channel.send(invitesEmbed);
    
            })  
            .catch(console.error);
        }
    });
}
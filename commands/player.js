const request = require('request');
module.exports = function(args, config, Discord, message, v1) {


    function getUUID(name, callback) {
        request('https://api.mojang.com/users/profiles/minecraft/' + name, {
            json: true
        }, (err, res, body) => {
            if (err) {
                console.error(err);
                callback(err)
            } else {
                callback(null, body)
            }
        });
    }



    var playerName = args[0];
    if (typeof playerName === 'undefined') {
        return message.channel.send("Usage `-player {name}`");
    } else {
        const profileEmbed = new Discord.MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Player Profile')
            .setDescription('Loading...')
            .setTimestamp().setFooter('Lost Lands')

        message.channel.send(profileEmbed).then(function(msg) {
            v1.player(playerName, function(err, player) {
                if (err) {
                    if (err.error == "Player not found.") {
                        return message.channel.send("That player has never played on Lost Lands before.");
                    } else {
                        console.error(err);
                    }
                } else {
                    getUUID(playerName, function(err, mojangResponse) {
                        if (err) {
                            return message.channel.send("Failed to find Minecraft account.");
                        } else {
                            if (mojangResponse && mojangResponse.name) {
                                if (player.info.favorite_server == "crystalpvp") {
                                    player.info.favorite_server = "Crystal PVP";
                                }
    
                                const profileEmbed = new Discord.MessageEmbed()
                                    .setAuthor(mojangResponse.name, 'https://minotar.net/avatar/' + mojangResponse.name, )
                                    .setTimestamp().setFooter('Lost Lands')
                                    .addFields({
                                        name: '**First Joined**',
                                        value: player.info.registered,
                                        inline: true
                                    }, {
                                        name: '**Last Seen**',
                                        value: player.info.last_seen,
                                        inline: true
                                    },{
                                        name: '**Total Playtime**',
                                        value: player.info.playtime,
                                        inline: true
                                    },{
                                        name: '**Activity Level**',
                                        value: player.info.activity_index_group,
                                        inline: true
                                    },{
                                        name: '**Favorite Server**',
                                        value: player.info.favorite_server,
                                        inline: true
                                    },{
                                        name: '**PVP kills**',
                                        value: player.kill_data.player_kills_total,
                                        inline: true
                                    },{
                                        name: '**PVP Deaths**',
                                        value: player.kill_data.player_deaths_total,
                                        inline: true
                                    },{
                                        name: '**KDR**',
                                        value: player.kill_data.player_kdr_total,
                                        inline: true
                                    },{
                                        name: '**Most Used Weapon**',
                                        value: player.kill_data.weapon_1st,
                                        inline: true
                                    })
    
    
                                if (player.info.online == true) {
                                    profileEmbed.setColor('#65C87A');
                                } else {
                                    profileEmbed.setColor('#0099ff');
                                }
                                msg.edit(profileEmbed);
                                
                            } else {
                                const profileEmbed = new Discord.MessageEmbed()
                                .setColor('#0099ff')
                                .setTitle('Player Profile')
                                .setDescription('That player does not exist.')
                                .setTimestamp().setFooter('Lost Lands')
                                msg.edit(profileEmbed);
                            }
                            
                            
                        }
                    })
                }
            });
        }).catch(function(err) {

        })


    }
}
const request = require('request');
const lostlandsAPI = require("node-lostlands-api");
const v1 = new lostlandsAPI.v1();

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

function dashedUUID(uuid) {
    return uuid.slice(0, 8) + "-" + uuid.slice(8, 12) + "-" + uuid.slice(12, 16) + "-" + uuid.slice(16, 20) + "-" + uuid.slice(20, 32)
}

function getDiscord(uuid, callback) {
    v1.linked(uuid, function(err, linked) {
        if (err) {
            if (err.error == "No linked accounts found.") {
                callback(null, null);
            } else {
                console.error(err);
                callback(err)
            }
        } else {
            callback(null, linked);
        }
    });
}

module.exports = (bot) => {
    bot.on("player", (message, content) => {
        var args = bot.split(content);
        var playerName = args[0];
        if (playerName.length < 1) {
            return message.channel.send("Usage `"+bot.config.prefix+"player {name}`");
        } else {
            const profileEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTitle('Player Profile')
                .setDescription('Loading...')
                .setTimestamp().setFooter('Lost Lands')

            message.channel.send(profileEmbed).then(function(msg) {
                v1.player(playerName, function(err, player) {
                    if (err) {
                        if (err.error == "Player not found.") {
                            const profileEmbed = new bot.Embed()
                                .setColor('#0099ff')
                                .setTitle('Player Profile')
                                .setDescription('That player has never played on Lost Lands before.')
                                .setTimestamp().setFooter('Lost Lands')
                            msg.edit(profileEmbed);
                        } else {
                            console.error(err);
                        }
                    } else {
                        getUUID(playerName, function(err, mojangResponse) {
                            if (err) {
                                return message.channel.send("Failed to find Minecraft account.");
                            } else {
                                if (mojangResponse && mojangResponse.name) {
                                    const profileEmbed = new bot.Embed()
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
                                        }, {
                                            name: '**Total Playtime**',
                                            value: player.info.playtime,
                                            inline: true
                                        }, {
                                            name: '**Activity Level**',
                                            value: player.info.activity_index_group,
                                            inline: true
                                        }, {
                                            name: '**Favorite Server**',
                                            value: player.info.favorite_server,
                                            inline: true
                                        }, {
                                            name: '**PVP kills**',
                                            value: player.kill_data.player_kills_total,
                                            inline: true
                                        }, {
                                            name: '**PVP Deaths**',
                                            value: player.kill_data.player_deaths_total,
                                            inline: true
                                        }, {
                                            name: '**KDR**',
                                            value: player.kill_data.player_kdr_total,
                                            inline: true
                                        }, {
                                            name: '**Most Used Weapon**',
                                            value: player.kill_data.weapon_1st,
                                            inline: true
                                        })
                                    if (player.info.favorite_server == "crystalpvp") {
                                        player.info.favorite_server = "Crystal PVP";
                                    }



                                    if (player.info.online == true) {
                                        profileEmbed.setColor('#65C87A');
                                    } else {
                                        profileEmbed.setColor('#0099ff');
                                    }
                                    getDiscord(dashedUUID(mojangResponse.id), function(err, discord) {
                                        if (err) {
                                            console.error(err);
                                        } else {
                                            if (discord && discord.discord) {
                                                profileEmbed.addField('**Discord**', `<@${discord.discord}>`);
                                            }
                                        }

                                        msg.edit(profileEmbed);

                                    });
                                } else {
                                    const profileEmbed = new bot.Embed()
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
                message.channel.send("I encountered an error while looking up that player.")
                console.log(err);
            })
        }
    });
}
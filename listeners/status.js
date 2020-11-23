  
const request = require('request');
var playersString;

module.exports = (bot) => {
    bot.on("status", (message, content) => {
        var args = bot.split(content);
        if (args[0]) {
            //specific server
            const statsEmbed = new bot.Embed()
            .setColor('#0099ff')
            .setTitle('Server Status')
            .setDescription('Loading...')
            .setURL('https://status.lostlands.co/')
            .setTimestamp().setFooter('status.lostlands.co')
    
            message.channel.send(statsEmbed).then(function(msg) {
                const statsEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTimestamp().setFooter('status.lostlands.co')
                .setURL('https://status.lostlands.co/');
                request('https://query.lostlands.co/status/'+args[0], function(error, response, body) {
                    if (!error && response.statusCode == 200 && body) {
                        var query = JSON.parse(body);
    
                        statsEmbed.setTitle("Server Status");
                        
                        if (query.success == true) {
                            var playerArray = query.data.players;
                            if (playerArray.length == 1) {
                                statsEmbed.setDescription(`${query.data.onlinePlayers} Player on `+"`"+args[0]+"`")
                            } else {
                                statsEmbed.setDescription(`${query.data.onlinePlayers} Players on `+"`"+args[0]+"`")
                            }
                            var playerlist = "";
                            var i;
                            for (i = 0; i < playerArray.length; i++) {
                                playerlist += playerArray[i].name + " ";
                            }
    
                            if (playerlist.length > 0) {
                                statsEmbed.addField('Players', playerlist);
                            }
                            
                        }
                        else {
                            statsEmbed.setDescription("Server offline.")
                        }
    
    
                    } else {
                        statsEmbed.setTitle('Server Status');
                        statsEmbed.setDescription("Error getting status for that server.");
                    }
                    msg.edit(statsEmbed);
                })
    
            }).catch(function(err) {
                message.channel.send("Error getting server status.");
            })
        } else {
            const statsEmbed = new bot.Embed()
            .setColor('#0099ff')
            .setTitle('Lost Lands Status')
            .setURL('https://status.lostlands.co/')
            .setDescription('Loading...')
        
            .setTimestamp().setFooter('status.lostlands.co')
            
        
            message.channel.send(statsEmbed).then(function(msg) {
                const statsEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTitle('Lost Lands Status')
                .setURL('https://status.lostlands.co/')
                .addField('**Discord Members:**', message.guild.memberCount, true)
        
                .setTimestamp().setFooter('status.lostlands.co')
                
        
                request('https://mcapi.us/server/status?ip=lostlands.co', function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var mcapi = JSON.parse(body);
                        request('https://query.lostlands.co/status/evolutions', function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                var query = JSON.parse(body);
                                if (query.success == true) {
                                    playersString = parseInt(mcapi.players.now) + parseInt(query.data.onlinePlayers);
                                } else {
                                    playersString = mcapi.players.now
                                }
                            } else {
                                playersString = mcapi.players.now;
                            }
        
                            statsEmbed.addField("**Online Players:**", playersString, true)
                            request.post(
                                'https://api.uptimerobot.com/v2/getMonitors', {
                                    json: {
                                        "api_key": bot.config.uptimerobot_key,
                                        "format": "json"
                                    }
                                },
                                function(error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        potentialOutage = false
                                        outage = false
                                        if (body.error) {
                                            statsEmbed.setDescription('Unable to get server status. Is https://status.lostlands.co up?')
                                        } else {
                                            body.monitors.forEach(function(server) {
                                                if (server.status === 0) {
                                                    statsEmbed.addField("**" + server.friendly_name + ":**", '⚫ Paused', true);
                                                } else if (server.status === 2) {
                                                    statsEmbed.addField("**" + server.friendly_name + ":**", '🟢 Online', true);
                                                } else if (server.status === 8) {
                                                    statsEmbed.addField("**" + server.friendly_name + ":**", '🟡 Unknown', true);
                                                    potentialOutage = true
                                                } else if (server.status === 9) {
                                                    outage = true
                                                    statsEmbed.addField("**" + server.friendly_name + ":**", '🔴 Offline', true);
                                                }
                        
                                            })
                                            if (typeof outage !== 'undefined' && outage === true) {
                                                statsEmbed.setDescription('❌ Server outage detected.')
                                            } else if (typeof potentialOutage !== 'undefined' && potentialOutage === true) {
                                                statsEmbed.setDescription('⚠️ Potential/partial server outage detected.')
                                            } else {
                                                statsEmbed.setDescription('✅ All services operational.')
                                            }
                                        }
                                    } else {
                                        statsEmbed.setDescription('Unable to get server status. Is https://status.lostlands.co up?')
                                    }
                                    msg.edit(statsEmbed);
                                }    
                            )
                        });
                    }
                });
        
            }).catch(function(err) {
                if (err) {
                    message.channel.send("Failed to get status.");
                }
            })
        }
    })
}
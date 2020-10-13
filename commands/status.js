const request = require('request');
var playersString;



module.exports = function(config, Discord, message) {

    const statsEmbed = new Discord.MessageEmbed()
    .setColor('#0099ff')
    .setTitle('Lost Lands Status')
    .setURL('https://status.lostlands.co/')
    .setDescription('Loading...')

    .setTimestamp().setFooter('status.lostlands.co')
    

    message.channel.send(statsEmbed).then(function(msg) {
        const statsEmbed = new Discord.MessageEmbed()
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
                                "api_key": config.uptimerobot_api_key,
                                "format": "json"
                            }
                        },
                        function(error, response, body) {
                            if (!error && response.statusCode == 200) {
                                potentialOutage = false
                                outage = false
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
                            } else {
                                message.channel.send("Unable to get server status. Is https://status.lostlands.co/ up?")
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
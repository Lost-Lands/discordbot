const request = require('request');
const ms = require("../minestat");
module.exports = function(config, Discord, message) {
    request.post(
        'https://api.uptimerobot.com/v2/getMonitors', {
            json: {
                "api_key": config.uptimerobot_api_key,
                "format": "json"
            }
        },


        function(error, response, body) {
            if (!error && response.statusCode == 200) {
                const statsEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Lost Lands Status')
                    .setURL('https://status.lostlands.co/')
                    .addField('**Discord Members:**', message.guild.memberCount, true)

                    .setTimestamp().setFooter('Lost Lands')

                ms.init('srv03.lostlands.co', 25580, function(result) {
                    //ms.address
                    //ms.port
                    //ms.online
                    //ms.max_players
                    //ms.current_players
                    //ms.motd
                    //ms.latency
                    if (ms.online) {
                        statsEmbed.addField("**Online Players:**", ms.current_players, true);
                    } else {
                        statsEmbed.addField("**Online Players:**", "Error", true);
                    }
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
                    statsEmbed.addField('**Status Website:**', '🟢 Online', true)
                    message.channel.send(statsEmbed)
                });
            } else {
                return callback("Unable to get server status.");
            }
        }

    )
};
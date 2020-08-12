const request = require('request');
var geoip = require('geoip-lite');
const YAML = require('yaml')
var mysql = require('mysql');

module.exports = function(args, config, Discord, message, connection, c) {
    var playerName = args[0];
    if (typeof playerName === 'undefined') {
        return message.channel.send("Usage `-player {name}`");
    } else if (args[0] == "admin") {
        return message.channel.send("That player has never played on Lost Lands before.");
    } else {
        var playerNameLowercase = playerName.replace(/\W/g, '').toLowerCase();
        //SELECT * FROM wp_users WHERE user_login LIKE "${playerNameLowercase}"
        var username = mysql.format(connection.escape(playerNameLowercase))
        connection.query(`
                            SELECT * FROM wp_users
                            INNER JOIN premium  
                            ON wp_users.realname = premium.name AND wp_users.user_login=${username} 
                        `, function(error, data) {
            if (error) {
                return message.channel.send("That player has never played on Lost Lands before.");
            } else {
                var player = JSON.parse(JSON.stringify(data))[0];

                if (typeof player === 'undefined') {
                    return message.channel.send("That player has never played on Lost Lands before.");
                }




                let joindate_ob = new Date(player.regdate);
                let joindate = ("0" + joindate_ob.getDate()).slice(-2);
                let joinmonth = ("0" + (joindate_ob.getMonth() + 1)).slice(-2);
                let joinyear = joindate_ob.getFullYear();
                let joinhours = joindate_ob.getHours();
                let joinminutes = joindate_ob.getMinutes();
                let joinseconds = joindate_ob.getSeconds();

                let logindate_ob = new Date(player.last_login);
                let logindate = ("0" + logindate_ob.getDate()).slice(-2);
                let loginmonth = ("0" + (logindate_ob.getMonth() + 1)).slice(-2);
                let loginyear = logindate_ob.getFullYear();
                let loginhours = logindate_ob.getHours();
                let loginminutes = logindate_ob.getMinutes();
                let loginseconds = logindate_ob.getSeconds();

                var joindate_pretty = joinmonth + "/" + joindate + "/" + joinyear + " " + joinhours + ":" + joinminutes + ":" + joinseconds;
                var logindate_pretty = loginmonth + "/" + logindate + "/" + loginyear + " " + loginhours + ":" + loginminutes + ":" + loginseconds;

                const playerEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Player Profile')
                    .setAuthor(player.realname, 'https://minotar.net/avatar/' + player.realname, )
                    .addFields({
                        name: '**First Joined**',
                        value: joindate_pretty,
                        inline: true
                    }, {
                        name: '**Last Seen**',
                        value: logindate_pretty,
                        inline: true
                    }, )
                    .setTimestamp()
                    .setFooter('Lost Lands');

                if (joinmonth === "07" && joindate < "20") {
                    playerEmbed.setDescription("Note: This player may have joined prior to the listed date, but current records only go back to 7/10")
                }


                //Retrive proper UUID

                request('http://tools.glowingmines.eu/convertor/nick/' + player.realname, function(error, response, body) {
                    console.error('error:', error); // Print the error if one occurred

                    var uuidAPI = JSON.parse(body);

                    if (player.UUID) {
                        var dashedUUID = require("add-dashes-to-uuid")(player.UUID)
                    } else {
                        var dashedUUID = uuidAPI.offlinesplitteduuid
                    }


                    if (player.Premium === 1) {
                        playerEmbed.setURL('https://namemc.com/profile/' + player.UUID);
                    }
                    var uuid = mysql.format(connection.escape(dashedUUID))


                    connection.query(`SELECT * from votes WHERE uuid = ${uuid}`, function(error, data) {
                        if (error) {
                            console.log(error);
                            playerEmbed.addField("**Votes**", "0", true);
                        } else {
                            var votes = JSON.parse(JSON.stringify(data));
                            if (votes === []) {
                                playerEmbed.addField("**Votes**", votes[0].votes, true)
                            } else {
                                playerEmbed.addField("**Votes**", "0", true);
                            };


                            //Check if command is run inside the admin guild
                            if (message.guild.id == config.admin_guild) {
                                //true
                                var location_json = geoip.lookup(player.last_ip)
                                var location = "Coordinates: " + location_json.ll[0] + ", " + location_json.ll[1] + "\n" + location_json.city + ", " + location_json.region + ", " + location_json.country;

                                playerEmbed.addFields({
                                    name: '**Premium**',
                                    value: player.Premium,
                                    inline: true
                                }, {
                                    name: '**UUID**',
                                    value: dashedUUID,
                                    inline: true
                                }, {
                                    name: '**Registered IP**',
                                    value: player.regip,
                                    inline: true
                                }, {
                                    name: '**Last IP**',
                                    value: player.last_ip,
                                    inline: true
                                }, {
                                    name: '**Last Geolocation**',
                                    value: location,
                                    inline: true
                                }, )
                                var essentialsPath = "/plugins/Essentials/userdata/" + dashedUUID + ".yml"

                                c.get(essentialsPath, function(err, stream) {
                                    if (err) {
                                        playerEmbed.addField("**Essentials Data:**", "Unable to data.", true);
                                    } else {
                                        var content = '';
                                        stream.on('data', function(chunk) {

                                            content += chunk.toString();
                                        });
                                        stream.on('end', function() {
                                            var essentials = YAML.parse(content)

                                            function world(world) {
                                                if (world == "anarchy2020") {
                                                    return "overworld"
                                                } else if (world == "anarchy2020_nether") {
                                                    return "nether"
                                                } else if (world == "anarchy2020_the_end") {
                                                    return "end"
                                                } else {
                                                    return "unknown world"
                                                }
                                            }
                                            var logoutLocation = world(essentials.logoutlocation['world']) + ": " + essentials.logoutlocation['x'] + ", " + essentials.logoutlocation['y'] + ", " + essentials.logoutlocation['z']
                                            var lastLocation = world(essentials.lastlocation['world']) + ": " + essentials.lastlocation['x'] + ", " + essentials.lastlocation['y'] + ", " + essentials.lastlocation['z']
                                            playerEmbed.addFields({
                                                name: '**Logout Location**',
                                                value: logoutLocation,
                                                inline: true
                                            }, {
                                                name: '**Last Location**',
                                                value: lastLocation,
                                                inline: true
                                            }, {
                                                name: '**Last Recorded Username**',
                                                value: essentials.lastAccountName,
                                                inline: true
                                            }, )

                                            var lastip = mysql.format(connection.escape(player.last_ip))
                                            var regip = mysql.format(connection.escape(player.regip))
                                            connection.query(`
                                                    SELECT realname from wp_users WHERE last_ip = ${lastip}
                                                    UNION
                                                    SELECT realname from wp_users WHERE regip = ${regip}
                                                    UNION
                                                    SELECT realname from wp_users WHERE last_ip = ${regip}
                                                    UNION
                                                    SELECT 
                                                    realname from wp_users WHERE regip = ${lastip}
                                                    `, function(error, data) {
                                                if (error) {
                                                    console.log(error);
                                                } else {
                                                    if (data) {
                                                        var player = JSON.parse(JSON.stringify(data));

                                                        listalts_old = function(player) {
                                                            Object.keys(player).forEach(function(name) {
                                                                return JSON.stringify(player[name]) + "\n"
                                                            })
                                                        }

                                                        var alts = "";
                                                        var i;

                                                        for (i = 0; i < player.length; i++) {
                                                            alts += player[i].realname + "\n"
                                                        }



                                                        playerEmbed.addField("**Accounts**", alts, true);

                                                    } else {
                                                        playerEmbed.addField("**Accounts**", "None", true);
                                                    }
                                                    message.channel.send(playerEmbed).then(function() {
                                                        essentials = undefined;
                                                        content = undefined;
                                                    });
                                                }
                                            });
                                        });
                                    }
                                })
                            } else {
                                return message.channel.send(playerEmbed);
                            }
                        }
                    });
                });
            }
        });
    }
}
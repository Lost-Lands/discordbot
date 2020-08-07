const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const config = require('./config.json');
const request = require('request');
var geoip = require('geoip-lite');
var FTPClient = require('ftp');
var c = new FTPClient();
const YAML = require('yaml')

var ms = require("./minestat");
var mysql = require('mysql');

const token = process.env.BOT_TOKEN || config.token;
const prefix = process.env.BOT_PREFIX || config.prefix;
const admin_guild = process.env.BOT_ADMIN_GUILD || config.admin_guild;
const invite_channel = process.env.BOT_INVITE_CHANNEL || config.invite_channel;
const suggestion_channel = process.env.BOT_SUGGESTION_CHANNEL || config.suggestion_channel;
const mysql_host = process.env.MYSQL_HOST || config.mysql_host;
const mysql_user = process.env.MYSQL_USER || config.mysql_user;
const mysql_pass = process.env.MYSQL_PASS || config.mysql_pass;
const mysql_database = process.env.MYSQL_DATABASE || config.mysql_database;
const ftp_host = process.env.FTP_HOST || config.ftp_host;
const ftp_user = process.env.FTP_USER || config.ftp_user;
const ftp_pass = process.env.FTP_PASS || config.ftp_pass;

var connection = mysql.createConnection({
    host: mysql_host,
    user: mysql_user,
    password: mysql_pass,
    database: mysql_database
});
c.connect({
    host: ftp_host,
    user: ftp_user,
    password: ftp_pass
});

const express = require('express')

const app = express()
const port = process.env.PORT || 3000

const {
    wakeDyno,
    wakeDynos
} = require('heroku-keep-awake');
const e = require('express');
const {
    join
} = require('path');

const DYNO_URL = 'https://lostlands-clansbot.herokuapp.com/';

app.get('/', (req, res) => res.send('Lost Lands Discord Bot Running.'))

app.get('/api/votes', function(req,res) {
    
});

app.listen(port, () => {

    wakeDyno(DYNO_URL);

    console.log(`Discord Bot Web UI Running`)

})


const client = new Discord.Client();
const talkedRecently = new Set();

client.once('ready', () => {
    console.log('Lost Lands Discord bot running.');
    client.user.setActivity("-help");
});
c.on('ready', function() {
    console.log("Connected to FTP");
    client.on('message', (message) => {

        if (!message.content.startsWith(prefix) || message.author.bot) return;
        if (!message.guild) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args.shift().toLowerCase();

        if (talkedRecently.has(message.author.id)) {
            message.reply("You must wait `8s` before commands.");
        } else {

            if (command === 'ping') {
                message.channel.send('Pong!');
            } else if (command === 'rolestat') {
                message.guild.roles.fetch()
                    .then(roles => console.log(`There are ${roles.cache.size} roles.`))
                    .catch(console.error);

            } else if (command === 'help') {
                const helpEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Lost Lands Bot')
                    .setURL('https://lostlands.co')
                    .setDescription("Hi, I'm new! I don't have many commands yet but here is what I can do:")
                    .addFields({
                        name: '**Server status:**',
                        value: '`-status`'
                    }, {
                        name: '**Suggestion:**',
                        value: '`-suggest {suggestion}`'
                    }, {
                        name: '**Player info:**',
                        value: '`-player {name}`'
                    }, {
                        name: '**Eat?**',
                        value: '`-eat`'
                    }, )
                    .setTimestamp()
                    .setTimestamp().setFooter('Lost Lands')

                message.channel.send(helpEmbed);
            } else if (command === 'eat') {
                if (message.channel.id == "735692290919628881") {
                    message.channel.send('***eat***');
                } else {
                    message.reply("this isnt #eat 🤨");
                }

            } else if (command == "player") {
                var playerName = args[0];
                if (typeof playerName === 'undefined') {
                    return message.channel.send("Usage `-player {name}`");
                } else if (args[0] == "admin"){
                    return message.channel.send("That player has never played on Lost Lands before.");
                } else {
                    var playerNameLowercase = playerName.replace(/\W/g, '').toLowerCase();
                    //SELECT * FROM wp_users WHERE user_login LIKE "${playerNameLowercase}"
                    var username = mysql.format(connection.escape(playerNameLowercase))
                    console.log(username);
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

                            request('http://tools.glowingmines.eu/convertor/nick/'+player.realname, function (error, response, body) {
                                console.error('error:', error); // Print the error if one occurred


                                console.log('glowingmines statusCode:', response && response.statusCode); // Print the response status code if a response was received

                                var uuidAPI = JSON.parse(body);

                                //f72c7e6c-cff0-31b6-bf47-cce2ec75ff6a

                                if (player.UUID) {
                                    var dashedUUID = require("add-dashes-to-uuid")(player.UUID)
                                }
                                else {
                                    var dashedUUID = uuidAPI.offlinesplitteduuid
                                }


                                if (player.Premium === 1) {
                                    playerEmbed.setURL('https://namemc.com/profile/' + player.UUID);
                                }
                                var uuid = mysql.format(connection.escape(dashedUUID))

                                console.log(uuid);

                                connection.query(`SELECT * from votes WHERE uuid = ${uuid}`, function (error, data) {
                                    if (error) {
                                        console.log(error);
                                        playerEmbed.addField("**Votes**", "0", true);
                                    } else {
                                        var votes = JSON.parse(JSON.stringify(data));
                                        playerEmbed.addField("**Votes**", votes[0].votes, true);


                                        //Check if command is run inside the admin guild
                                if (message.guild.id == admin_guild) {
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
                                                console.log(content);
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
    
                                                console.log(logoutLocation);
    
                                                var lastLocation = world(essentials.lastlocation['world']) + ": " + essentials.lastlocation['x'] + ", " + essentials.lastlocation['y'] + ", " + essentials.lastlocation['z']
    
                                                console.log(lastLocation);
    
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
    
                                                var uuid = mysql.format(connection.escape(dashedUUID))
                                                connection.query(`SELECT * from votes WHERE uuid = ${uuid}`, function (error, data) {
                                                    if (error) {
                                                        console.log(error);
                                                        playerEmbed.addField("**Votes**", "0", true);
                                                    } else {
                                                        if (data) {
                                                            var votes = JSON.parse(JSON.stringify(data));
                                                            console.log(votes[0]);
                                                            playerEmbed.addField("**Votes**", votes[0].votes, true);
                                                            
                                                        } else {
                                                            playerEmbed.addField("**Votes**", "0", true);
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
                                }
                                else {
                                    return message.channel.send(playerEmbed);
                                }
                                    }
                                });
                            });
                        }
                    });
                }
            } else if (command == "suggest" || command == "suggestion") {

                noPrefix = message.content.slice(prefix.length).trim()
                suggestion = noPrefix.substr(noPrefix.indexOf(" ") + 1)


                if (typeof suggestion === 'undefined') {
                    return message.channel.send("Usage: `-suggestion {suggestion}`");
                } else {
                    if (suggestion.length < 2048) {
                        const suggestionEmbed = new Discord.MessageEmbed()
                            .setColor('#0099ff')
                            .setDescription(suggestion)
                            .setTimestamp()
                            .setFooter("Lost Lands (Open)")

                        if (message.author.avatarURL() !== null) {
                            suggestionEmbed.setAuthor("Suggestion from " + message.author.username, message.author.avatarURL())
                        } else {
                            suggestionEmbed.setAuthor("Suggestion from " + message.author.username)
                        }

                        client.channels.cache.get(suggestion_channel).send({
                            embed: suggestionEmbed
                        }).then(embedMessage => {
                            embedMessage.react('✅').then(() => embedMessage.react('❌'));
                        });
                        return message.reply("Thanks for your suggestion!");
                    } else {
                        message.reply("That suggestion is too long. Suggestions must be less than 2048 characters.")
                    }


                }
            } else if (command == "accept") {



                if (!message.member.roles.cache.some((role) => role.name === "2b2t.lol")) {
                    return message.reply("You do not have permission accept suggestions");
                } else {

                    if (typeof args[0] == 'undefined') {
                        return message.reply("Usage: `-accept {message ID}`");
                    }

                    client.channels.cache.get(suggestion_channel).messages.fetch(args[0])
                        .then(function(message) {

                            var messageData = JSON.parse(JSON.stringify(message.embeds[0]))
                            const suggestionEmbed = new Discord.MessageEmbed()
                                .setColor('#75ed0c')
                                .setDescription("" + messageData.description + "")
                                .setTimestamp(messageData.createdTimestamp)
                                .setFooter("Lost Lands (Accepted)")
                            if (messageData.author.icon_url !== null) {
                                console.log(messageData.author.name);
                                suggestionEmbed.setAuthor(messageData.author.name, messageData.author.icon_url)
                            } else {
                                suggestionEmbed.setAuthor(messageData.author.name)
                            }

                            message.edit(suggestionEmbed);
                        });
                    return message.reply("Accepted suggestion.")
                }
            } else if (command == "deny") {

                if (!message.member.roles.cache.some((role) => role.name === "2b2t.lol")) {
                    return message.reply("You do not have permission deny suggestions");
                } else {

                    if (typeof args[0] == 'undefined') {
                        return message.reply("Usage: `-deny {message ID}`");
                    }

                    client.channels.cache.get(suggestion_channel).messages.fetch(args[0])
                        .then(function(message) {

                            var messageData = JSON.parse(JSON.stringify(message.embeds[0]))
                            const suggestionEmbed = new Discord.MessageEmbed()
                                .setColor('#E9251A')
                                .setDescription("" + messageData.description + "")
                                .setTimestamp(messageData.createdTimestamp)
                                .setFooter("Lost Lands (Denied)")
                            if (messageData.author.icon_url !== null) {
                                console.log(messageData.author.name);
                                suggestionEmbed.setAuthor(messageData.author.name, messageData.author.icon_url)
                            } else {
                                suggestionEmbed.setAuthor(messageData.author.name)
                            }

                            message.edit(suggestionEmbed);
                        });
                    return message.reply("Denied suggestion.")
                }
            } else if (command == 'stats' || command == 'status') {
                request.post(
                    'https://api.uptimerobot.com/v2/getMonitors', {
                        json: {
                            "api_key": process.env.UPTIMEROBOT_API_KEY || config.uptimerobot_api_key,
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
                                    console.log(server.friendly_name + ": " + server.status);
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
            } else if (command === 'clan') {
                
            }
            talkedRecently.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after 8 seconds.
                talkedRecently.delete(message.author.id);
            }, 8000);
        }
    });
});

client.login(token);
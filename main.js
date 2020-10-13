const Discord = require('discord.js');
var FTPClient = require('ftp');
var c = new FTPClient();
var mysql = require('mysql');
const config = require("./load_config")
var MongoClient = require('mongodb').MongoClient;

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

const DYNO_URL = 'https://lostlands-discordbot.herokuapp.com/';

app.get('/', (req, res) => res.send('Lost Lands Discord Bot Running.'))

app.listen(port, () => {

    wakeDyno(DYNO_URL);

    console.log(`Discord Bot Web UI Running`)

})

const client = new Discord.Client();
const talkedRecently = new Set();

var connection = mysql.createConnection({
    host: config.mysql_host,
    user: config.mysql_user,
    password: config.mysql_pass,
    database: config.mysql_database
});
c.connect({
    host: config.ftp_host,
    user: config.ftp_user,
    password:  config.ftp_pass
});

c.on('ready', function() {

    client.once('ready', () => {
        console.log('Lost Lands Discord bot running.');
        client.user.setActivity("-help");
    });

    console.log("Connected to FTP");

    MongoClient.connect(config.mongodb, function(err, db)  {
        if (err) throw err;

        client.on("guildMemberAdd", function(member){ //User Joins
            const joinEmbed = new Discord.MessageEmbed()
                .setColor('#49ff0f')
                .setDescription(`${member.user.username}#${member.user.discriminator} just joined! They're member #${member.guild.memberCount}`)
            client.channels.cache.get(config.joins_channel).send(joinEmbed)
        });
        client.on("guildMemberRemove", function(member){ //User Leaves
            const leaveEmbed = new Discord.MessageEmbed()
                .setColor('#ff0f0f')
                .setDescription(`${member.user.username}#${member.user.discriminator} just left. There are now ${member.guild.memberCount} members.`)
            client.channels.cache.get(config.joins_channel).send(leaveEmbed)
        });

        client.on("guildMemberUpdate", function(oldMember, newMember){
            if (oldMember.roles.cache.size < newMember.roles.cache.size) {
                // role added
                var newRoles = newMember.roles.cache.map(x => x.id);
                var oldRoles = oldMember.roles.cache.map(x => x.id);

                newRoles = newRoles.filter(function(val){
                    return (oldRoles.indexOf(val) == -1 ? true : false)
                })
                if (newRoles.indexOf(config.vip_role) > -1) {
                    //User was added to VIP
                    client.channels.cache.get(config.vip_channel).send(`🎉 ${newMember} has received VIP!`);
                }
                else if (newRoles.indexOf(config.vip_plus_role) > -1) {
                    //User was added to VIP+
                    client.channels.cache.get(config.vip_channel).send(`🎉 ${newMember} has received VIP+!`);
                }
            } else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
                // role removed
                var newRoles = newMember.roles.cache.map(x => x.id);
                var oldRoles = oldMember.roles.cache.map(x => x.id);

                oldRoles = oldRoles.filter(function(val){
                    return (newRoles.indexOf(val) == -1 ? true : false)
                })

                if (oldRoles.indexOf(config.vip_role) > -1) {
                    //User was removed from VIP
                    client.channels.cache.get(config.vip_channel).send(`❌ ${newMember}'s VIP status expired.`);
                }
                else if (oldRoles.indexOf(config.vip_plus_role) > -1) {
                    //User was removed from VIP+
                    client.channels.cache.get(config.vip_channel).send(`❌ ${newMember}'s VIP+ status expired.`);
                }
                
            }
        });

        client.on('message', (message) => {
            if (message.content == "/discord link") {
                message.reply("https://help.lostlands.co/article/link-your-discord")
            }
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if (message.guild) {
                if (message.author.bot) return;
                if (message.content.startsWith(config.prefix)) {
                    if (talkedRecently.has(message.author.id)) {
                        message.reply("You must wait `8s` between commands.");
                    } else {
            
                        if (command === 'ping') {
                            message.channel.send('Pong!');
                        } else if (command == 'rolestat') {
                            message.guild.roles.fetch()
                                .then(roles => console.log(`There are ${roles.cache.size} roles.`))
                                .catch(console.error);
                        } else if (command =='eat') {
                            if (message.channel.id == "735692290919628881") {
                                message.channel.send('***eat***');
                            } else {
                                message.reply("this isnt #eat 🤨");
                            }
                        } else if (command == 'help') {
                            require("./commands/help")(args, Discord, message);
                            talkedRecently.add(message.author.id);
                        } else if (command == 'badges' || command == "badge") {
                            require("./commands/badges")(Discord, message);
                            talkedRecently.add(message.author.id);
                        } else if (command == "player") {
                            require("./commands/player")(args, config, Discord, message, connection, c);
                            talkedRecently.add(message.author.id);
                        } else if (command == "suggest") {
                            require("./commands/suggest")(config, Discord, client, message);
                            talkedRecently.add(message.author.id);
                        } else if (command == "accept") {
                            require("./commands/accept")(args, config, Discord, client,  message);
                            talkedRecently.add(message.author.id);
                        } else if (command == "deny") {
                            require("./commands/deny")(args, config, Discord, client, message);
                            talkedRecently.add(message.author.id);
                        } else if (command == "inprogress") {
                            require("./commands/in-progress")(args, config, Discord, client, message);
                            talkedRecently.add(message.author.id);
                        } else if (command == 'status') {
                            talkedRecently.add(message.author.id);
                            require("./commands/status")(args, config, Discord, message);
                        }         
                        setTimeout(() => {
                            // Removes the user from the set after 8 seconds.
                            talkedRecently.delete(message.author.id);
                        }, 8000);
                    }
                }
            }
        });
    });
});

client.login(config.token);

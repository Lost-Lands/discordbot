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
        client.on('message', (message) => {
            const args = message.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            
            if (message.guild) {
                if (message.author.bot) return;
                if (message.content.startsWith(config.prefix)) {
                    if (talkedRecently.has(message.author.id)) {
                        message.reply("You must wait `8s` before commands.");
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
                        } else if (command == 'achievements' || command == "achievement") {
                            require("./commands/achievement")(Discord, message);
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
                        } else if (command == 'stats' || command == 'status') {
                            talkedRecently.add(message.author.id);
                            require("./commands/status")(config, Discord, message);
                        } 
    
                        //Ticketing
                        else if (command == "tnew") {
                            require("./tickets/new")(args, config, Discord, client, message, db);
                        }
                        
                        
                        setTimeout(() => {
                            // Removes the user from the set after 8 seconds.
                            talkedRecently.delete(message.author.id);
                        }, 8000);
                    }
                } else {
                    if (message.channel.parentID === config.ticketsCategory) {
                        require("./tickets/staff-reply")(Discord, client, message, db);
                    }
                }
            } else {

                //Direct Messages to the bot
                if (command === "close") {
                    require("./tickets/close")(args, config, Discord, client, message, db);
                } else {
                    require("./tickets/user-reply")(args, config, Discord, client, message, db);
                }
            }
        });
    });
});

client.login(config.token);
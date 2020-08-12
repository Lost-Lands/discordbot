const Discord = require('discord.js');
const oldconfig = require('./config.json');
var FTPClient = require('ftp');
var c = new FTPClient();
var mysql = require('mysql');
const config = require("./load_config")

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
    client.on('message', (message) => {

        if (!message.content.startsWith(config.prefix) || message.author.bot) return;
        if (!message.guild) return;

        const args = message.content.slice(config.prefix.length).trim().split(/ +/);
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
            } else if (command === 'eat') {
                if (message.channel.id == "735692290919628881") {
                    message.channel.send('***eat***');
                } else {
                    message.reply("this isnt #eat 🤨");
                }
            } else if (command === 'help') {
                require("./commands/help")(Discord, message);
            } else if (command == "player") {
                require("./commands/player")(args, config, Discord, message, connection, c);
            } else if (command == "suggest" || command == "suggestion") {
                require("./commands/suggest")(config, Discord, client, message);
            } else if (command == "accept") {
                require("./commands/accept")(args, config, Discord, client,  message);
            } else if (command == "deny") {
                require("./commands/deny")(args, config, Discord, client, message);
            } else if (command == 'stats' || command == 'status') {
                require("./commands/status")(config, Discord, message);
                
            }

            talkedRecently.add(message.author.id);
            setTimeout(() => {
                // Removes the user from the set after 8 seconds.
                talkedRecently.delete(message.author.id);
            }, 8000);
        }
    });
});

client.login(config.token);
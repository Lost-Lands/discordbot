const Discord = require("./bot");
const fs = require("fs");
const path = require("path");
const config = require('./config').config;

const bot = new Discord.Client(config)

// Keep bot awake
const express = require('express')
const app = express();
const port = process.env.PORT || 3000
const { wakeDyno } = require('heroku-keep-awake');
const DYNO_URL = 'https://lostlands-discordbot.herokuapp.com/';
app.get('*', (req, res) => res.send('Lost Lands Discord Bot Running.'))
app.listen(port, () => {
    wakeDyno(DYNO_URL);
    console.log(`[INFO] Discord Bot Web UI Running`)
});


bot.on("ready", () => {
    console.log("[INFO] Lost Lands Discord Bot Running.")
    bot.setActivity("WATCHING", "for -help", (err, presence)  => {
        if (err) {
            console.error(err);
        } else {
            console.log("[INFO] Presence Updated");
        }
    })
    //load all files in /listeners
    const listenersLocation = path.join(__dirname, 'listeners')
    let listeners
    try {
        listeners = fs.readdirSync(listenersLocation)
    }
    catch (err) {
        fs.mkdirSync(listenersLocation)
        listeners = []
    }
    listeners = listeners.filter((fileName) => fileName.toLowerCase().endsWith('.js'))
    listeners.forEach(listener => {
        var name = listener.slice(0, -3)
        console.log(`[INFO] Loading listener "${name}"`);
        require(path.join(listenersLocation, listener))(bot)
    });
});

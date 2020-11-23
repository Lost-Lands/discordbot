const Discord = require('discord.js');
const client = new Discord.Client();
const { EventEmitter } = require("events");

class Client extends EventEmitter {
    constructor(config) {
        super();
        const client = new Discord.Client();
        client.login(config.token);
        client.once('ready', () => {
            this.client = client;
            this.emit('ready');
        });

        this.config = config;
        this.Embed = Discord.MessageEmbed;

        this.setActivity = function(type, activity, callback) {
            if (this.client) {
                client.user.setActivity(activity, { type: type })
                    .then(presence => callback(null, presence))
                    .catch(error => callback(error));
            } else {
                callback("Bot not logged in");
            }
        }

        this.guild = function(id, callback) {
            //returns guild if the bot is a member
            if (this.client) {
                var guild = client.guilds.cache.get(id);
                if (guild) {
                    callback(null, guild);
                } else {
                    callback("Guild not found");
                }
            } else {
                callback("Bot not logged in");
            }
        }
        this.split = function(content) {
            return content.split(/ +/);
        }
        const cooldown = new Set();
        client.on('message', (message) => {
            if (message.guild) {
                if (message.author.bot) return; //ignore other bot messages
                if (message.content.startsWith(config.prefix)) {

                    var content = message.content.slice(config.prefix.length).trim();
                    const args = this.split(content);
                    const command = args.shift().toLowerCase();
                    if (config.commands.indexOf(command) > -1) { //message is a command
                        if (cooldown.has(message.author.id)) {
                            message.reply("You must wait `"+config.cooldown+"s` between commands.");
                            console.warn(`[WARN] ${message.author.username}#${message.author.discriminator} (${message.author.id}) issued command too quickly: ${message.content}`)
                        } else {
                            cooldown.add(message.author.id);
                            content = content.slice(command.length).trim();
                            console.log(`[INFO] ${message.author.username}#${message.author.discriminator} (${message.author.id}) issued command: ${message.content}`)
                            this.emit(command, message, content);
                        }
                        setTimeout(() => {
                            //Removes the user from the set after the cooldown.
                            cooldown.delete(message.author.id);
                        }, config.cooldown * 1000);
                    }
                }
                else {
                    this.emit("message", message);
                }
            } else {
                this.emit("directMessage", message);
            }
        });
        client.on("guildMemberAdd", (member) => {
            console.log(`[INFO] ${member.user.username}#${member.user.discriminator} (${member.user.id}) joined ${member.guild.name} (${member.guild.id})`);
            this.emit("join", member);
        });
        client.on("guildMemberRemove", (member) => {
            console.log(`[INFO] ${member.user.username}#${member.user.discriminator} (${member.user.id}) left ${member.guild.name} (${member.guild.id})`);
            this.emit("leave", member);
        });

        client.on("guildMemberUpdate", (oldMember, newMember) => {
            if (oldMember.roles.cache.size < newMember.roles.cache.size) {
                //role added
                var newRoles = newMember.roles.cache.map(x => x.id);
                var oldRoles = oldMember.roles.cache.map(x => x.id);
    
                var addedRoles = newRoles.filter(function(val) {
                    return (oldRoles.indexOf(val) == -1 ? true : false)
                });
                this.emit("roleAdded", newMember, addedRoles);
            } else if (oldMember.roles.cache.size > newMember.roles.cache.size) {
                //role removed
                var newRoles = newMember.roles.cache.map(x => x.id);
                var oldRoles = oldMember.roles.cache.map(x => x.id);

                var removedRoles = oldRoles.filter(function(val) {
                    return (newRoles.indexOf(val) == -1 ? true : false)
                });
                this.emit("roleRemoved", newMember, removedRoles);
            }
        });

    }
}
module.exports = { Client }

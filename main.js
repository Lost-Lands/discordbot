const Discord = require('discord.js');
const MessageEmbed = require('discord.js');
const config = require('./config.json');

const token = process.env.BOT_TOKEN || config.token;
const prefix = process.env.BOT_PREFIX || config.prefix;
const clans_category = process.env.BOT_CLANS_CATEGORY || config.clans_category;
const invite_channel = process.env.BOT_INVITE_CHANNEL || config.invite_channel;


const express = require('express')
const app = express()
const port = process.env.PORT || 3000

app.get('/', (req, res) => res.send('Lost Lands Clans Bot Running.'))

app.listen(port, () => console.log(`Clans Bot Web UI Running`))

{ prefix, token, clans_category } 

const client = new Discord.Client();

client.once('ready', () => {
    console.log('Lost Lands Clan bot running.');
    client.user.setActivity("-clan");   
});

client.on('message', (message) => {

	if (!message.content.startsWith(prefix) || message.author.bot) return;
    if (!message.guild) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
        message.channel.send('Pong!');
    } else if (command === 'rolestat') {
        message.guild.roles.fetch()
            .then(roles => console.log(`There are ${roles.cache.size} roles.`))
            .catch(console.error);
    
	} else if (command === 'clan') {
		if (!args.length) {
            return message.channel.send(`Please tell me what you'd like to do, ${message.author}!`);
        }
        else if (args[0] === "create" || args[0] === "new") {
            if (typeof args[1] === 'undefined') {
                return message.channel.send(`Please include a clan name, ${message.author}!`);
            }
            else if (typeof args[2] !== 'undefined') {
                return message.channel.send(`Clan names must not have any spaces, ${message.author}!`);
            }
            else {

                console.log('Request to create clan: "'+args[1]+'"');


                message.guild.roles.create({ //Create the clan default role
                    data: {
                        name: "[C] "+args[1],
                        color: '#148603',
                    }
                }).then(function(role) {
                    console.log('Created new role: "'+role.name+'"')
                    message.member.roles.add(role.id).catch(console.error);
                    
                    //Create Clan Channel
                    var channelname = args[1].replace(/\W/g, '').toLowerCase(); //Lower case the new clan name
                        message.guild.channels.create("'"+channelname+"'", {
                            type: 'text',
                            parent: clans_category,
                            permissionOverwrites: [
                                {
                                    id: role.id, //Give clan role permissions
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                },
                                {
                                    
                                    id: "736507266081226753", //Give bot permissions
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
                                },
                                {
                                    id: message.guild.roles.everyone.id, //Deny access to @everyone
                                    deny: ["VIEW_CHANNEL"]
                                }
                            ],
                        }).then(function(channel) {
                            console.log('Created new role: "'+channel.name+'"')
                            client.channels.cache.get(channel.id).send(`Welcome to ${args[1]}, ${message.author}!`);
                        }).catch(console.error);

                    //Create the clan Admin role
                    message.guild.roles.create({ 
                        data: {
                            name: "[C] "+args[1]+" admin",
                            color: '#148603',
                        }
                    }).then(function(role) {
                        console.log('Created new role: "'+role.name+'"')
                        message.member.roles.add(role.id).catch(console.error);      
                    }).catch(console.error);

                }).catch(console.error);
               

                const clanSuccess = new Discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Created clan: '+args[1])
                    .addFields(
                        { name: 'Founded by: ', value: message.author.username }
                    )
                    .setTimestamp()
                    .setFooter('Lost Lands Clans');

                message.channel.send(clanSuccess);
                //message.channel.send('Created clan "'+args[1]+'"');
                
            }
            
        }
        else if (args[0] === "disband" || args[0] === "delete") {
            if (typeof args[1] === 'undefined') {
                return message.channel.send(`Please include a clan name, ${message.author}!`);
            }
            else if (typeof args[2] !== 'undefined') {
                return message.channel.send(`Clan names must not have any spaces, ${message.author}!`);
            }
            else {
                console.log("Attempting to disband "+args[1]);
                console.log("Searching for memberRole: [C] "+args[1]);
                var memberRole = message.guild.roles.cache.find(r => r.name === "[C] "+args[1]);
                console.log("Searching for adminRole: [C] "+args[1]+" admin")
                var adminRole = message.guild.roles.cache.find(r => r.name === "[C] "+args[1]+" admin");

                if (typeof memberRole === 'undefined') {
                    console.log("Unable to find memberRole: [C] "+args[1]);
                    return message.channel.send("Could not find that clan.");
                }
                else if (typeof adminRole === 'undefined') {
                    console.log("Unable to find adminRole: [C] "+args[1]+" admin");
                    return message.channel.send("Could not find that clan.");
                }
                else {
                    if (!message.member.roles.cache.some((role) => role.name === "[C] "+args[1]+" admin")) {
                        return message.reply("You are not admin of that clan.");
                    }
                    else {
                    message.reply("Please confirm disbanding "+args[1]+" with 👍 or 👎");
                    message.react('👍').then(() => message.react('👎'));

                    const filter = (reaction, user) => {
                        return ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id;
                    };

                    message.awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
                        .then(collected => {
                            const reaction = collected.first();

                            if (reaction.emoji.name === '👍') {
                                
                                console.log("Attempting to delete clan "+args[1])
                                    memberRole.delete('Clan disbanded').then(function(deleted) {
                                        console.log(`Deleted role ${deleted.name}`);
                                            adminRole.delete('Clan disbanded').then(function(deleted) {
                                                console.log(`Deleted role ${deleted.name}`);
                                                console.log("Roles have been deleted. Attempting to delete text channel...");
                                                
                                                var channelname = args[1].replace(/\W/g, '').toLowerCase();
                                                var channelSelector = message.guild.channels.cache.find(r => r.parentID === '736628211471089715' && r.name === "'"+channelname+"'");
                                                if (typeof channelSelector === 'undefined'){
                                                    console.log(channelSelector);
                                                    console.log("Channel "+channelname+" not found. Exiting.")
                                                    return message.channel.send("Error (1) deleting clan channel. Please use -new in #server-help to contact us.");
                                                }   
                                                else {

                                                    channelSelector.delete('Clan disbanded')
                                                    .then(function(deleted) {
                                                        console.log("Channel "+channelSelector.name+" deleted successfully.")
                                                        console.log(channelSelector.name+" completely disbanded.")
                                                        return client.channels.cache.get('736634261213413456').send(`**${channelSelector.name}** has been disbanded by ${message.author}!`);
                                                    }).catch(function(error) {
                                                        //console.log("Channel "+channelname+" failed to delete. Exiting.")
                                                        //eturn message.channel.send("Error (2) deleting clan channel. Please use -new in #server-help to contact us.");
                                                    });

                                                    
                                                }

                                            }).catch(function(err) {
                                                return message.channel.send("Error deleting clan. Please use -new in #server-help to contact us.");
                                            });
                                    }).catch(function(err) {
                                        console.log(err);
                                        return message.channel.send("Error deleting clan. Please use -new in #server-help to contact us.");
                                    });
                            } else {
                                return message.channel.send(args[1]+" will not be disbaneded.");
                            }
                        })
                    }
                    

                }
                
                
            }
            

        } else if (args[0] === "invite" || args[0] === "add"){
            if (typeof args[1] === 'undefined') {
                return message.channel.send(`Please include a clan name, ${message.author}!`);
            }
            else if (typeof args[2] === 'undefined') {
                return message.channel.send(`Please include the person you are trying to invite, ${message.author}!`);
            }
            else {
                if (!message.member.roles.cache.some((role) => role.name === "[C] "+args[1]+" admin")) {
                    return message.reply("You do not have permission to invite members");
                }
                else {
                    
                    
                    var inviteMemberID = args[2].substring(3).slice(0, -1)
                    var invitedMemberSelector = client.users.cache.get(inviteMemberID)

                    if (inviteMemberID === message.author) {
                        return message.channel.send(`You cannot invite yourself.`);
                    }
                    


                    message.channel.send(`Invite sent.`);
                    

                    client.channels.cache.get(invite_channel).send(args[2]+", you have been invited to **"+args[1]+"**! Invite expires in 24 hours. Please accept or reject with 👍 or 👎").then(function(message){
                        message.react('👍').then(() => message.react('👎'));
                        const filter = (reaction, user) => {
                            return ['👍', '👎'].includes(reaction.emoji.name) && user.id === inviteMemberID;
                        };
                        invitedMemberSelector.send("You have been invited to **"+args[1]+"**! Invite expires in 24 hours. Please view this message to accept or decline: https://discordapp.com/channels/712881309701111860/736817703251214377/"+message.id);
                        message.awaitReactions(filter, { max: 1, time: 86400000, errors: ['time'] })
                        .then(collected => {
                            if(message.react.bot) return
                            const reaction = collected.first();

                            if (reaction.emoji.name === '👍') {
                                var memberRole = message.guild.roles.cache.find(r => r.name === "[C] "+args[1]);

                                const member = message.mentions.members.first();
                                member.roles.add(memberRole.id).then(function(data){
                                    console.log(data);
                                    return message.channel.send("✅ Accepted invite to **"+args[1]+"**!");
                                }).catch(function(err) {
                                    return message.channel.send("There was an error accepting your invite. Please contact us in #server-help by starting a new ticket with -new");
                                });
                                
                            } else if (reaction.emoji.name === '👎') {
                                return message.channel.send("❌ Rejected invite to **"+args[1]+"** ☹️");
                            }
                            else {
                                return message.channel.send("You failed to react with 👍 or 👎 and now "+args[1]+" doesn't want you anymore.");
                            }
                        })
                      });
                }
                
            }
        }
        else {
            return message.channel.send(`Unknown command.`);
        }
	}
});

client.login(token);
module.exports = function(Discord, message) {
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
}
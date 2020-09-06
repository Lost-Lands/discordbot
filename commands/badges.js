module.exports = function(Discord, message) {
    const helpEmbed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Badges')
        .setDescription("🔥 OG (Joined before 7/20)\n🌈 50 or more votes\n💯 100 or more votes")
        .setTimestamp()
        .setTimestamp().setFooter('Lost Lands')

    message.channel.send(helpEmbed);
}
module.exports = (bot) => {
    bot.on("leave", (member) => {
        const leaveEmbed = new bot.Embed()
            .setColor('#ff0f0f')
            .setDescription(`${member.user.username}#${member.user.discriminator} just left. There are now ${member.guild.memberCount} members.`)
        bot.client.channels.cache.get(bot.config.channels.leave).send(leaveEmbed)
    });
}
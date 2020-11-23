module.exports = (bot) => {
    bot.on("join", function(member) {
        const joinEmbed = new bot.Embed()
            .setColor('#49ff0f')
            .setDescription(`${member} just joined! They're member #${member.guild.memberCount}`)
        bot.client.channels.cache.get(bot.config.channels.join).send(joinEmbed)
    });
}
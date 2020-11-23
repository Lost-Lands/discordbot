module.exports = (bot) => {
    bot.on("help", (message, content) => {
        var args = bot.split(content);
        if (args[0] == "anarchy") {
            //Anarchy help page
            const helpEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTitle('Lost Lands Bot - Anarchy Commands')
                .setDescription("")
                .addFields({
                    name: '**TPS:**',
                    value: '`anarchy.tps`',
                    inline: true
                }, {
                    name: '**Online Players:**',
                    value: '`anarchy.online`',
                    inline: true
                }, {
                    name: '**Total Players:**',
                    value: '`anarchy.joins`',
                    inline: true
                }, {
                    name: '**Uptime**',
                    value: '`anarchy.uptime`',
                    inline: true
                })
                .setTimestamp()
                .setTimestamp().setFooter('Lost Lands');
            message.channel.send(helpEmbed);
        } else if (args[0] == "cpvp") {
            //Anarchy help page
            const helpEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTitle('Lost Lands Bot - Crystal PVP Commands')
                .setDescription("")
                .addFields({
                    name: '**TPS:**',
                    value: '`cpvp.tps`',
                    inline: true
                }, {
                    name: '**Online Players:**',
                    value: '`cpvp.online`',
                    inline: true
                }, {
                    name: '**Total Players:**',
                    value: '`cpvp.joins`',
                    inline: true
                }, {
                    name: '**Uptime**',
                    value: '`cpvp.uptime`',
                    inline: true
                })
                .setTimestamp()
                .setTimestamp().setFooter('Lost Lands');
            message.channel.send(helpEmbed);
        } else {
            const helpEmbed = new bot.Embed()
                .setColor('#0099ff')
                .setTitle('Lost Lands Bot - Help')
                .setDescription("Hi, I'm new! I don't have many commands yet but here is what I can do:")
                .addFields({
                    name: '**Status:**',
                    value: '`-status <server>`',
                    inline: true
                }, {
                    name: '**Suggestion:**',
                    value: '`-suggest`',
                    inline: true
                }, {
                    name: '**Check Invites:**',
                    value: '`-invites <@user>`',
                    inline: true
                }, {
                    name: '**Player info:**',
                    value: '`-player`',
                    inline: true
                }, {
                    name: '**List Badges**',
                    value: '`-badges`',
                    inline: true
                }, {
                    name: '**Anarchy**',
                    value: '`-help anarchy`',
                    inline: true
                }, {
                    name: '**Crystal PVP**',
                    value: '`-help cpvp`',
                    inline: true
                }, {
                    name: '**Eat?**',
                    value: '`-eat`',
                    inline: true
                } )
                .setTimestamp()
                .setTimestamp().setFooter('Lost Lands');
            message.channel.send(helpEmbed);
        }
    });
}
module.exports = (bot) => {
    bot.on("roleAdded", (member, addedRoles) =>  {   
        //check if user recieved a VIP role
        if (addedRoles.indexOf(bot.config.roles.vip) > -1) {
            //User was added to VIP
            bot.client.channels.cache.get(bot.config.channels.vip).send(`🎉 ${member} has received VIP!`);
        } else if (addedRoles.indexOf(bot.config.roles.vip_plus) > -1) {
            //User was added to VIP+
            bot.client.channels.cache.get(bot.config.channels.vip).send(`🎉 ${member} has received VIP+!`);
        }
    });
    bot.on("roleRemoved", (member, removedRoles) =>  {
        //check if user lost a VIP status
        if (removedRoles.indexOf(bot.config.roles.vip) > -1) {
            //User was removed from VIP
            bot.client.channels.cache.get(bot.config.channels.vip).send(`❌ ${member}'s VIP status expired.`);
        } else if (removedRoles.indexOf(bot.config.roles.vip_plus) > -1) {
            //User was removed from VIP+
            bot.client.channels.cache.get(bot.config.channels.vip).send(`❌ ${member}'s VIP status expired.`);
        }
    });
}
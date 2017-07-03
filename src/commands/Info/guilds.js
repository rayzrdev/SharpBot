const oneLine = require('common-tags').oneLine;

exports.run = (bot, msg) => {

    let servers = bot.guilds.array().sort((a, b) => b.memberCount - a.memberCount).map(guild => {
        return {
            name: guild.name,
            value: oneLine`
                ${guild.memberCount} users,
                ${guild.channels.size} channels
            `
        };
    });

    for (let i = 0; i < servers.length / 20; i += 20) {
        msg.edit('', {
            embed: bot.utils.embed(`${bot.user.username}'s Servers`, '\u200b', servers.slice(i, i + 20), { inline: true })
        });
    }
};

exports.info = {
    name: 'guilds',
    usage: 'guilds',
    description: 'Lists all guilds that you\'re a member of'
};

const oneLine = require('common-tags').oneLine;
const utils = require('../utils');

exports.run = function (bot, msg) {

    let servers = bot.guilds.array().sort((a, b) => b.memberCount - a.memberCount).map(guild => {
        return {
            name: guild.name,
            value: oneLine`
                ${guild.memberCount} users,
                ${guild.channels.size} channels
            `
        };
    });

    msg.edit('', {
        embed: utils.embed(`${bot.user.username}'s Servers`, '\u200b', servers, { inline: true })
    });
};

exports.info = {
    name: 'guilds',
    usage: 'guilds',
    description: 'Lists all guilds that you\'re a member of'
};
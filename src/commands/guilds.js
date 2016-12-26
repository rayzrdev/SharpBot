const utils = require('../utils');

exports.run = function (bot, msg) {
    msg.edit('', {
        embed: utils.embed(`${bot.user.username}'s Servers`, `${bot.user.username} is a part of the following servers:\n\n${bot.guilds.map(g => '- ' + g.name).sort().join('\n')}`)
    });
};

exports.info = {
    name: 'guilds',
    usage: 'guilds',
    description: 'Lists all guilds that you\'re a member of'
};
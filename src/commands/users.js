const utils = require('../utils');

exports.run = function (bot, msg) {
    var users = msg.guild.members.map(m => m.user.username + m.user.bot ? '[BOT]' : '');
    var length = users.reduce((a, b) => a.length > b.length ? a : b).length;
    msg.delete();
    utils.sendLarge(msg.channel, `,_${'_'.repeat(length)}_,\n| ${' '.repeat(length)} |\n` +
        msg.guild.members
            .map(m => m.user.username + m.user.bot ? '[BOT]' : '')
            .sort().sort((a, b) => a.length - b.length)
            .map(n => `| ${n}${' '.repeat(length - n.length)} |`).join('\n') +
        `\n|_${'_'.repeat(length)}_|`, { prefix: '```', suffix: '```' });
};

exports.info = {
    name: 'users',
    usage: 'users',
    description: 'Lists all users on your current server'
};
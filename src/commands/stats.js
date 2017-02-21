const Discord = require('discord.js');
const utils = require('../utils');

exports.run = function (bot, msg) {
    msg.edit('', {
        embed: utils.embed('SharpBot Stats', '***This message will dissappear in 15 seconds.***', [
            {
                name: 'Owner:',
                value: `<@${bot.user.id}>`,
            },
            {
                name: 'Discord.js',
                value: `v${Discord.version}`,
            },
            {
                name: 'Mem Usage:',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            },
            {
                name: 'Users:',
                value: `${bot.users.size.toLocaleString()}`,
            },
            {
                name: 'Servers:',
                value: `${bot.guilds.size.toLocaleString()}`,
            },
            {
                name: 'Channels:',
                value: `${bot.channels.size.toLocaleString()}`,
            },
        ], { inline: true })
    }).then(m => m.delete(15000));
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about SharpBot'
};
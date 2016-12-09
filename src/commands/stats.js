const utils = require('../utils');

exports.run = function (bot, msg) {
    msg.edit('', {
        embed: utils.embed('SharpBot Stats', `

This message will dissappear in 10 seconds.


**Servers:** ${bot.guilds.size}

**Users:** ${bot.users.size}

**RAM:** ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

`)
    }).then(m => m.delete(10000));
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about SharpBot'
};
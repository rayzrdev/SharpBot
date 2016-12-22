const utils = require('../utils');

exports.run = function (bot, msg) {
    if (msg.mentions.users.size < 1) {
        msg.edit(':no_entry_sign: @\u200bmention some people to shoot!').then(m => m.delete(2000));
        return;
    }
    var output = '';
    msg.mentions.users.forEach(m => {
        output += `__${m.username}__  :gun:  __${bot.user.username}__\n`;
    });

    msg.edit('', { embed: utils.embed(`${bot.user.username} is on a shooting spree!`, output) });
};

exports.info = {
    name: 'shoot',
    usage: 'shoot <user>',
    description: 'Shoots yer friendz!'
};
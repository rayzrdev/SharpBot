exports.run = function (bot, msg) {
    bot.afk = true;
    msg.edit(':white_check_mark: You are now AFK').then(m => m.delete(2000));
};

exports.info = {
    name: 'afk',
    usage: 'afk',
    description: 'Marks you as AFK'
};
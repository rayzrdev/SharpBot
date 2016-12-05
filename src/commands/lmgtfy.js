exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must provide something to search for!').then(m => m.delete(2000));
        return;
    }
    msg.edit(`**Wow!** :arrow_right: http://www.lmgtfy.com/?q=${args.join('+')}`);
};

exports.info = {
    name: 'lmgtfy',
    usage: 'lmgtfy [search text]',
    description: 'Links to LMGTFY with the given search text'
};  
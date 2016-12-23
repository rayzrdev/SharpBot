exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must input text to be reversed!').then(m => m.delete(2000));
        return;
    }
    msg.edit(args.join(' ').split('').reverse().join(''));
};

exports.info = {
    name: 'reverse',
    usage: 'reverse <text>',
    description: 'Reverses the text you input'
};
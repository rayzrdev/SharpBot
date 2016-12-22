exports.run = function(bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must provide text to space out!').then(m => m.delete(2000));
        return;
    }
    var amount = 2;
    if (!isNaN(args[0])) {
        amount = parseInt(args[0]);
        (amount < 1) && (amount = 1);
        (amount > 15) && (amount = 15);
        args = args.slice(1);
    }
    msg.edit(args.join(' '.repeat(amount / 2)).split('').join(' '.repeat(amount)));
};

exports.info = {
    name: 'space',
    usage: 'space <text>',
    description: 'Spaces out text to look all dramatic n\' stuff'
};
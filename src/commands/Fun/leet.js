exports.run = function(bot, message, args) {

    if (args.length < 1) {
        throw 'Provide text to be leeted.';
    }


    const parsed = args.join(' ').replace(/[a-z]/g, function f(a) {
        return '4BCD3F6H1JKLMN0PQR57' [parseInt(a, 36) - 10] || a.replace(/[a-t]/gi, f);
    });

    message.channel.send(parsed.toLowerCase());
};

exports.info = {
    name: 'leet',
    usage: 'leet <text>',
    description: 'Talk like true gamers'
};

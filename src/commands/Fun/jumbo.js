exports.run = function (bot, msg, args) {

    if (args.length < 1) {
        throw 'Please provide an emoji to enlarge';
    }

    if (args[0].charCodeAt(0) >= 55296) {
        msg.delete();
        msg.channel.send({
            embed: bot.utils.embed(args[0], 'Can not enlarge built-in discord emoji.')
        }).then(m => m.delete(15000));

        return;
    }

    const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);

    if (!match[1]) {
        throw 'Please provide a valid emoji!';
    }

    const emoji = bot.emojis.get(match[1]);

    if(!emoji) {
        throw 'That emoji could not be identified.';
    }

    msg.delete();
    msg.channel.send({
        file: emoji.url
    });

};

exports.info = {
    name: 'jumbo',
    usage: 'jumbo <emoji>',
    description: 'Enlarges emojis!'
};

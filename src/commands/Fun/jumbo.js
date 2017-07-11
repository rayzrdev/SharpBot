exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'Please provide an emoji to enlarge.';
    }

    if (args[0].charCodeAt(0) >= 55296) {
        throw 'Cannot enlarge built-in discord emoji.';
    }

    const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);

    if (!match || !match[1]) {
        throw 'Please provide a valid emoji.';
    }

    const emoji = bot.emojis.get(match[1]);

    if (!emoji) {
        throw 'That emoji could not be identified!';
    }

    msg.delete();
    msg.channel.send({
        files: [
            emoji.url
        ]
    });
};

exports.info = {
    name: 'jumbo',
    usage: 'jumbo <emoji>',
    description: 'Enlarges emojis!'
};

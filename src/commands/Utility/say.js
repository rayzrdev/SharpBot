exports.run = (bot, msg, args) => {
    const parsed = bot.utils.parseArgs(args, ['c:']);
    const { leftover } = parsed;

    if (leftover.length < 1) {
        throw 'You must put something to say!';
    }

    let channel = msg.channel;
    if (parsed.options.c) {
        const id = parsed.options.c.match(/\d{18}/)[0];

        if (!id) {
            throw 'Invalid channel!';
        }

        channel = bot.channels.get(id);
        if (!channel) {
            throw 'That channel could not be found!';
        }
    }

    msg.delete();
    channel.send(leftover.join(' '));
};

exports.info = {
    name: 'say',
    usage: 'say <message>',
    description: 'Says the message you put. Useful for shortcuts.',
    options: [
        {
            name: '-c',
            usage: '-c <channel|channel ID>',
            description: 'Specifies a specific channel to send the message in'
        }
    ]
};

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide an emoji to gather info on!';
    }

    if (args[0].charCodeAt(0) >= 55296) {
        msg.delete();

        msg.channel.send({
            embed: bot.utils.embed(args[0], 'Built-in **Discord** emoji.')
        }).then(m => m.delete(15000));

        return;
    }

    const match = args[0].match(/<:[a-zA-Z0-9_-]+:(\d{18})>/);

    if (!match[1]) {
        throw 'Please provide a valid emoji!';
    }

    const emoji = bot.emojis.get(match[1]);

    if (!emoji) {
        throw 'That emoji could not be identified.';
    }

    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed('', '', [
            {
                name: 'Name',
                value: emoji.name
            },
            {
                name: 'From Guild',
                value: emoji.guild.name
            },
            {
                name: 'ID',
                value: emoji.id
            },
            {
                name: 'Download URL',
                value: emoji.url
            }
        ], { thumbnail: emoji.url })
    }).then(m => m.delete(15000));
};

exports.info = {
    name: 'emoji',
    usage: 'emoji <emoji>',
    description: 'Shows information about an emoji'
};

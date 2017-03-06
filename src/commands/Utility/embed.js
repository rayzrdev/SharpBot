exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify some text!';
    }

    var parsed = bot.utils.parseArgs(args, ['f', 'c:']);

    msg.delete();
    msg.channel.sendEmbed(
        bot.utils.embed('', parsed.leftover.join(' '), [], {
            footer: !!parsed.options.f,
            color: parsed.options.c
        })
    );
};

exports.info = {
    name: 'embed',
    usage: 'embed [-i] [-c <color>] [text]',
    description: 'Sends a message via embeds'
};
exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify some text!';
    }

    var parsed = bot.utils.parseArgs(args, ['f', 'c:', 'r', 'i:']);

    var color = parsed.options.c;
    if (parsed.options.r && msg.guild && msg.guild.members) {
        var member = msg.guild.members.get(msg.author.id);
        if (member) {
            color = member.highestRole.hexColor;
        }
    }

    msg.delete();
    msg.channel.sendEmbed(
        bot.utils.embed('', parsed.leftover.join(' '), [], {
            footer: !!parsed.options.f,
            color,
            image: parsed.options.i
        })
    );
};

exports.info = {
    name: 'embed',
    usage: 'embed [-f] [-r] [-c <color>] [-i <imageURL>] [text]',
    description: 'Sends a message via embeds'
};
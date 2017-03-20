exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify something to embed!';
    }

    var parsed = bot.utils.parseArgs(args, ['f', 'ft:', 't:', 'c:', 'r', 'i:']);

    var color = parsed.options.c;
    if (parsed.options.r && msg.guild && msg.guild.members) {
        var member = msg.guild.members.get(msg.author.id);
        if (member) {
            color = member.highestRole.hexColor;
        }
    }

    msg.delete();
    msg.channel.sendEmbed(
        bot.utils.embed(parsed.options.t || '', parsed.leftover.join(' '), [], {
            footer: parsed.options.f || parsed.options.ft,
            color,
            image: parsed.options.i
        })
    );
};

exports.info = {
    name: 'embed',
    usage: 'embed [text]',
    description: 'Sends a message via embeds',
    options: [
        {
            name: '-f',
            description: 'Shows the footer'
        },
        {
            name: '-ft',
            usage: '-ft <text>',
            description: 'Sets the footer text (use quotes for multiple words)'
        },
        {
            name: '-t',
            usage: '-t <text>',
            description: 'Sets the embed title (use quotes for multiple words)'
        },
        {
            name: '-r',
            description: 'Uses your role color for the embed color'
        },
        {
            name: '-c',
            usage: '-c <color>',
            description: 'Sets a hex color for the embed in the format of `#RRGGBB`'
        },
        {
            name: '-i',
            usage: '-i <url>',
            description: 'Sets an image for the embed'
        }
    ]
};
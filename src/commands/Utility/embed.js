exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify something to embed!';
    }

    let parsed = bot.utils.parseArgs(args, ['f', 'ft:', 'd', 't:', 'c:', 'r', 'i:', 'a:', 'th:']);

    let color = parsed.options.c;
    if (parsed.options.r && msg.guild && msg.guild.members) {
        let member = msg.guild.members.get(msg.author.id);
        if (member) {
            color = member.highestRole.hexColor;
        }
    }

    if (color) {
        if (!color.startsWith('#')) {
            color = `#${color}`;
        }

        if (!/^#[a-fA-F0-9]{6}$/.test(color)) {
            throw `Invalid color: \`${color}\`. Please use valid hex format (\`#RRGGBB\`)`;
        }
    }

    msg.delete();
    msg.channel.sendEmbed(
        bot.utils.embed(parsed.options.t || '', parsed.leftover.join(' '), [], {
            footer: parsed.options.f || parsed.options.ft,
            timestamp: parsed.options.d,
            color,
            image: parsed.options.i,
            author: parsed.options.a,
            thumbnail: parsed.options.th
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
            name: '-d',
            usage: '-d',
            description: 'Enables the timestamp (date) in the footer'
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
        },
        {
            name: '-a',
            usage: '-a <name>',
            description: 'Sets the author of the embed'
        },
        {
            name: '-th',
            usage: '-th <url>',
            description: 'Sets a thumbnail for the embed'
        }
    ]
};

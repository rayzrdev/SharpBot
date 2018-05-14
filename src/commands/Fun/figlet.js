const figlet = require('figlet');

exports.run = (bot, msg, args) => {
    // -l -- List all fonts
    // -f <font> -- Set font
    const parsed = bot.utils.parseArgs(args, ['l', 'f:']);

    if (parsed.options.l) {
        bot.utils.textUpload(figlet.fontsSync().join('\n')).then(({ url }) => {
            if (!url) {
                return msg.error('Failed to upload fonts list!');
            }

            msg.edit({
                embed: bot.utils.embed('Available Fonts', `A list of available fonts can be found [here](${url}).`)
            }).then(m => m.delete(5000));
        });
        return;
    }

    if (parsed.leftover.length < 1) {
        throw 'You must provide some text to render!';
    }

    const options = {};

    if (parsed.options.f) {
        options.font = parsed.options.f;
    }

    msg.delete();

    const input = parsed.leftover.join(' ');
    msg.channel.send(`\`\`\`\n${figlet.textSync(input, options)}\n\`\`\``);
};

exports.info = {
    name: 'figlet',
    usage: 'figlet <text>',
    description: 'Renders fancy ASCII text',
    options: [
        {
            name: '-f',
            usage: '-f <font>',
            description: 'Sets the font to use'
        },
        {
            name: '-l',
            description: 'Lists all available fonts'
        }
    ]
};

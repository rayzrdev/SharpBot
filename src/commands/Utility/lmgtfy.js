exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }

    let parsed = bot.utils.parseArgs(args, ['i']);

    msg.edit(`**Wow!** :arrow_right: http://www.lmgtfy.com/?iie=${parsed.options.i ? 1 : 0}&q=${parsed.leftover.join('+')}`);
};

exports.info = {
    name: 'lmgtfy',
    usage: 'lmgtfy [search text]',
    description: 'Links to LMGTFY with the given search text',
    options: [
        {
            name: '-i',
            usage: '-i',
            description: 'Enables Internet Explainer'
        }
    ]
};

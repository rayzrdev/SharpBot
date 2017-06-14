const webdict = require('webdict');

const makeCommand = method => {
    return (bot, msg, args) => {
        if (args.length < 1) {
            throw 'Please provide a word to search!';
        }

        const parsed = bot.utils.parseArgs(args, ['e']);
        const word = parsed.leftover.join(' ');

        webdict(method, word).then(res => {
            let result = res.definition[0];
            if (!res.definition[0]) {
                result = 'No results found.';
            }

            if (parsed.options.e) {
                msg.edit(result);
                return;
            }

            msg.delete();
            msg.channel.sendEmbed(
                bot.utils.embed(
                    `:book: ${word}`,
                    result
                )
            );
        });
    };
};

module.exports = [
    {
        run: makeCommand('dictionary'),
        info: {
            name: 'dictionary',
            aliases: ['dict'],
            usage: 'dictionary <word>',
            description: 'Looks a word up in the dictionary.',
            credits: 'NITEHAWK'
        }
    },
    {
        run: makeCommand('urbandictionary'),
        info: {
            name: 'urban',
            usage: 'urban <word>',
            description: 'Looks a word up in the urban dictionary.',
            credits: 'NITEHAWK'
        }
    }
];

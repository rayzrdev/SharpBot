const webdict = require('webdict');

exports.run = function (bot, msg, args) {

    if(args.length < 1) {
        throw 'Please provide a word to search!';
    }

    let parsed = bot.utils.parseArgs(args, ['e']);

    let word = parsed.leftover.join(' ');

    webdict('dictionary', word)
        .then(resp => {
            if(parsed.options.e) {
                msg.edit(resp.definition[0]);
                return;
            }
            msg.delete();
            msg.channel.sendEmbed(
                bot.utils.embed(
                    `:book: ${word}`,
                    resp.definition[0]
                )
            );
        });
};


exports.info = {
    name: 'dictionary',
    usage: 'dictionary [word]',
    description: 'Searches the given word on dictionary.com',
    credits: 'NITEHAWK'
};

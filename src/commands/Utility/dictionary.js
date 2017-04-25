const webdict = require('webdict');

exports.run = function (bot, msg, args) {

    if(args.length < 1) {
        throw 'Please provide a word to search!';
    }

    let word = args[0];

    webdict('dictionary', word)
        .then(resp => {
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

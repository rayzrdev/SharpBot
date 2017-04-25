const webdict = require('webdict');

exports.run = function (bot, msg, args) {

    if(args.length < 1) {
        throw 'Please provide a word to search!';
    }

    let word = args[0];

    webdict('urbandictionary', word)
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
    name: 'urban',
    usage: 'urban <word>',
    description: 'Searches the given word on urbandictionary.com',
    credits: 'NITEHAWK'
};

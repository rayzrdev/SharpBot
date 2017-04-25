const webdict = require('webdict');
const richEmbed = require('discord.js').RichEmbed;

exports.run = function (bot, msg, args) {
    msg.edit(':arrows_counterclockwise:');

    if(args.length < 1) {
        msg.edit('Please provide a word to search!').then(m => m.delete(30000));
    }

    let word = args[0];

    webdict('dictionary', word)
        .then(resp => {
            msg.delete();
            msg.channel.sendEmbed(
                new richEmbed()
                    .setTitle(`:book: ${word}`)
                    .setDescription(resp.definition[0])
                    .setFooter('SharpBot')
                    .setColor(0xff1234)
            );
        });
};


exports.info = {
    name: 'dictionary',
    usage: 'dictionary [word]',
    description: 'Searches the given word on dictionary.com',
    credits: 'NITEHAWK'
};

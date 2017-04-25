const webdict = require('webdict');
const richEmbed = require('discord.js').RichEmbed;

exports.run = function (bot, msg, args) {
    msg.edit(':arrows_counterclockwise:');
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

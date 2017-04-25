const webdict = require('webdict');
const richEmbed = require('discord.js').RichEmbed;

exports.run = function (bot, msg, args) {
    msg.edit(':arrows_counterclockwise:');
    let word = args[0];
    webdict('urbandictionary', word)
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
    name: 'urban',
    usage: 'urban [word]',
    description: 'Searches the given word on urbandictionary.com',
    credits: 'NITEHAWK'
};

// const RichEmbed = require('discord.js').RichEmbed;

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify something to convert';
    }

    // converter.convert(args.join(' '), function(err, value, str) {
    //     msg.delete();
    //
    //     var bc = '\`\`\`';
    //
    //     var message = new RichEmbed()
    //             .setColor(bot.utils.randomColor())
    //             .setTitle('Conversion')
    //             .addField('Input:', `${bc} ${args.join(' ')} ${bc}`)
    //             .addField('Output:', `${bc} ${value} ${str} ${bc}`)
    //             .addField('Error:', `${bc} ${err} ${bc}`);
    //
    //     msg.channel.sendEmbed(message);
    // });

};

exports.info = {
    name: 'convert',
    usage: 'convert <measurement> to <unit>',
    description: 'converts practically any unit, or timezones to another',
    credits: '<@136641861073764352>' // Abyss#0473
};

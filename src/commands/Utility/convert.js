const RichEmbed = require('discord.js').RichEmbed;
const got = require('got');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify something to convert';
    }

    var input = args.join(' ');
    var url = `https://api.duckduckgo.com/?q=${encodeURIComponent(input)}&format=json`;
    msg.edit(':arrows_counterclockwise:  Loading conversion...');

    got(url).then(res => {

        var data = JSON.parse(res.body);

        var answer = data['Answer'];
        var message;

        if (data['AnswerType'] === 'conversions') {
            msg.delete();

            answer = answer.replace('=', '\u2794');

            message = new RichEmbed()
                .setColor(bot.utils.randomColor())
                .addField('Conversion:', answer);

            msg.channel.sendEmbed(message);

        } else if (data['AnswerType'] === 'timezone_converter') {
            msg.delete();

            var matches = input.match(/(.*?)\s*(to|in)\s*(.*)/);
            var prefix;

            if (matches) {
                prefix = matches[1];
            } else {
                prefix = input;
            }

            message = new RichEmbed()
                .setColor(bot.utils.randomColor())
                .addField('Conversion:', `${prefix} \u2794 ${answer}`);

            msg.channel.sendEmbed(message);
        } else {
            msg.error(`No conversion found for ${input}`);
        }

    }).catch(err => {
        msg.error('DuckDuckGo returned an error. See console.');
        console.log(err);
    });
};

exports.info = {
    name: 'convert',
    usage: 'convert <measurement> to <unit>',
    description: 'converts practically any unit, or timezones to another, using DuckDuckGo searches',
    credits: '<@136641861073764352>' // Abyss#0473
};

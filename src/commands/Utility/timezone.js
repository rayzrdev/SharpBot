const RichEmbed = require('discord.js').RichEmbed;
const got = require('got');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify a time to convert';
    }

    let input = args.join(' ');
    let url = `https://api.duckduckgo.com/?q=${encodeURIComponent(input)}&format=json`;
    msg.edit(':arrows_counterclockwise:  Loading conversion...');

    got(url).then(res => {

        let data = JSON.parse(res.body);

        let answer = data['Answer'];
        let message;

        if (data['AnswerType'] === 'timezone_converter') {
            msg.delete();

            let matches = input.match(/(.*?)\s*(to|in)\s*(.*)/);
            let prefix;

            if (matches) {
                prefix = matches[1];
            } else {
                prefix = input;
            }

            message = new RichEmbed()
                .setColor(bot.utils.randomColor())
                .addField('Timezone:', `${prefix} \u2794 ${answer}`);

            msg.channel.sendEmbed(message);
        } else {
            msg.error(`No conversion found for ${input}`);
        }

    }).catch(err => {
        msg.error('DuckDuckGo returned an error. See console.');
        bot.logger.severe(err);
    });
};

exports.info = {
    name: 'timezone',
    usage: 'timezone <time> to <time>',
    description: 'converts between timezones, using DuckDuckGo searches',
    credits: '<@136641861073764352>' // Abyss#0473
};

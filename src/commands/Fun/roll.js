const Roll = require('roll');
const roller = new Roll();
const RichEmbed = require('discord.js').RichEmbed;

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify in dice notation (XdY)';
    }

    let reason = '';
    let footer = '';

    footer += `:game_die: **${args[0]}**`;
    if (args.length > 1) {
        reason = args.splice(1).join(' ');
        footer += ` | ${reason}`;
    }

    let results = roller.roll(args[0]);

    msg.delete();

    let message = new RichEmbed()
        .setColor(bot.utils.randomColor())
        .setTitle(`Total: ${results.result}`)
        .setDescription(`${[].concat.apply([], results.rolled).join(', ')}`)
        .addField('\u200b', footer);

    msg.channel.sendEmbed(message);
};

exports.info = {
    name: 'roll',
    usage: 'roll XdY <reason>',
    description: 'rolls X dice with Y sides. Supports standard dice notation',
    credits: '<@136641861073764352>' // Abyss#0473
};

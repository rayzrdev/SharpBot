exports.run = function (bot, msg) {
    if (msg.mentions.users.size < 1) {
        throw '@mention some people to shoot!';
    }

    var output = msg.mentions.users.map(m => `**${m}** :gun:`).join('\n');

    msg.delete();
    msg.channel.sendEmbed(
        bot.utils.embed(`${bot.user} is on a killing spree!`, output)
    );
};

exports.info = {
    name: 'shoot',
    usage: 'shoot <user>',
    description: 'Shoots yer friendz!'
};
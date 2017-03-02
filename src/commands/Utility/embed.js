exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify some text!';
    }

    msg.delete();
    msg.channel.sendEmbed(bot.utils.embed('', args.join(' '), [], { footer: false }));
};

exports.info = {
    name: 'embed',
    usage: 'embed [text]',
    description: 'Sends a message via embeds'
};
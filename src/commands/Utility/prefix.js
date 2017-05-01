exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide a prefix to set!';
    }

    const prefix = args.join(' ');
    bot.managers.config.set('prefix', prefix);
    msg.edit('Prefix set, rebooting! :ok_hand:').then(m => m.delete(3000));
};

exports.info = {
    name: 'prefix',
    usage: 'prefix <new prefix>',
    description: 'Sets the bot prefix'
};

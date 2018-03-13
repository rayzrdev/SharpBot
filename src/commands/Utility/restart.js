exports.run = async (bot, msg) => {
    await msg.edit(':wave: Restarting. Bye!');
    bot.shutdown(true);
};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: 'Restarts the bot'
};

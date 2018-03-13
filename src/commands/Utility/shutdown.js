exports.run = async (bot, msg) => {
    await msg.edit(':wave: Shutting down. Bye!');
    bot.shutdown(false);
};

exports.info = {
    name: 'shutdown',
    usage: 'shutdown',
    description: 'Fully shuts the bot down'
};

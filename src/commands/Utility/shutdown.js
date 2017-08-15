exports.run = async (bot, msg) => {
    await msg.edit(':wave: Shutting down. Bye!');
    process.exit(666);
};

exports.info = {
    name: 'shutdown',
    usage: 'shutdown',
    description: 'Fully shuts the bot down'
};

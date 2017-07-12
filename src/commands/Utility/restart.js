exports.run = async (bot, msg) => {
    await msg.edit(':wave: Restarting. Bye!');
    process.exit(42);
};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: 'Restarts the bot'
};

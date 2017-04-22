exports.run = (bot, msg) => {
    msg.edit(':wave: Restarting. Bye!').then(() => {
        process.exit(42);
    });
};

exports.info = {
    name: 'restart',
    usage: 'restart',
    description: 'Restarts the bot'
};

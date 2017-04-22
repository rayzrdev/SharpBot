exports.run = function (bot, msg, args) {
    let count = parseInt(args[0]) || 1;

    msg.delete();
    msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id })
        .then(messages => {
            Promise.all(messages.filter(m => m.author.bot === true)
                .map(m => m.delete()))
                .then(() => {
                    msg.channel.sendMessage(`:white_check_mark: Flushed \`${count}\` messages.`).then(m => m.delete(2000));
                });
        }).catch(msg.error);
};

exports.info = {
    name: 'flush',
    usage: 'flush <amount>',
    description: 'Deletes messages sent by bots'
};

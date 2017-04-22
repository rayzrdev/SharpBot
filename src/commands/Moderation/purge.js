exports.run = (bot, msg, args) => {
    let count = parseInt(args[0]) || 1;

    msg.delete();
    msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id })
        .then(messages => {
            Promise.all(messages.map(m => m.delete()))
                .catch(msg.error)
                .then(() => {
                    msg.channel.sendMessage(`:white_check_mark: Purged \`${count}\` messages.`)
                        .then(m => m.delete(2000));
                });
        }).catch(msg.error);
};

exports.info = {
    name: 'purge',
    usage: 'purge [amount]',
    description: 'Deletes a certain number of messages'
};

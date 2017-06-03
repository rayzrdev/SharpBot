exports.run = (bot, msg, args) => {
    let count = parseInt(args[0]) || 1;

    msg.delete();
    msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id }).then(messages => {
        const prunable = messages.filter(m => m.author.id === bot.user.id);

        return Promise.all(
            prunable.map(m => m.delete())
        ).then(() => {
            msg.channel.sendMessage(`:white_check_mark: Pruned \`${prunable.size}\` messages.`).then(m => m.delete(2000));
        });
    }).catch(msg.error);
};

exports.info = {
    name: 'prune',
    usage: 'prune [amount]',
    description: 'Deletes a certain number of messages sent by you'
};

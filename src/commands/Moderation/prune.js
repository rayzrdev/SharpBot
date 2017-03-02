exports.run = (bot, msg, args) => {
    let count = parseInt(args[0]) || 1;

    msg.channel.fetchMessages({ limit: Math.min(count + 1, 100) })
        .then(messages => {
            Promise.all(messages.filter(m => m.author.id === bot.user.id)
                .map(m => m.delete()))
                .then(() => {
                    msg.channel.sendMessage(`:white_check_mark: Pruned \`${count}\` messages.`).then(m => m.delete(2000));
                });
        }).catch(console.error);

};

exports.info = {
    name: 'prune',
    usage: 'prune [amount]',
    description: 'Deletes a certain number of messages sent by you'
};
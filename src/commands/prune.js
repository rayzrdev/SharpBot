exports.run = function (bot, msg, args) {
    let messagecount = parseInt(args[0]) || 1;

    var deletedMessages = -1;

    msg.channel.fetchMessages({ limit: Math.min(messagecount + 1, 100) })
        .then(messages => {
            messages.filter(m => m.author.id === bot.user.id)
                .forEach(m => { m.delete().catch(console.error); deletedMessages++; });
        }).then(() => {
            if (deletedMessages === -1) deletedMessages = 0;
            msg.channel.sendMessage(`:white_check_mark: Pruned \`${deletedMessages}\` messages.`)
                .then(m => m.delete(2000));
        }).catch(console.error);

};

exports.info = {
    name: 'prune',
    usage: 'prune [amount]',
    description: 'Deletes a certain number of messages sent by you'
};
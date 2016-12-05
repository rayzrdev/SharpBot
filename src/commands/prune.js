exports.run = function(bot, msg, args) {
    let messagecount = parseInt(args[0]) || 1;

    var deletedMessages = 0;

    msg.channel.fetchMessages({ limit: Math.min(messagecount + 1, 100) })
        .then(messages => {
            messages.array()
                .filter(m => m.author.id === bot.user.id)
                .forEach(m => { m.delete().catch(console.error); deletedMessages++; });
        });

    msg.channel.sendMessage(`:white_check_mark: Pruned \`${messagecount}\` messages.`)
        .then(m => m.delete(2000));
};

exports.info = {
    name: 'prune',
    usage: 'prune [amount]',
    description: 'Deletes a certain number of messages sent by you'
};
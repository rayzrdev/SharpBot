function makeCommand(name, viewName, description, filter) {
    return {
        run: async(bot, msg, args) => {
            let count = parseInt(args[0]) || 1;

            msg.delete();

            let pages = count / 100;

            let lastmsgid = msg.id;

            let totaldeleted = 0;

            for (var i = 0; i < pages; i++) {

                console.log('On Page', i);

                const messages = await msg.channel.fetchMessages({
                    limit: Math.min(count, 100),
                    before: lastmsgid
                });

                const deletable = messages.filter(function(message) {
                    lastmsgid = message.id;
                    return filter(message, bot);
                });

                await Promise.all(
                    deletable.map(m => {
                        if (m != null) {
                            m.delete()
                        }

                    })
                );

                const deleted = deletable.size;

                totaldeleted += deleted;

                if (deleted > 0) 
                {
                    console.log('Deleted ', deleted);
                }

            }


            console.log(`Deleted ${viewName} \`${totaldeleted}\` message${totaldeleted === 1 ? '' : 's'}.`);
            (await msg.channel.send(`:white_check_mark: ${viewName} \`${totaldeleted}\` message${totaldeleted === 1 ? '' : 's'}.`)).delete(2000);

        },
        info: {
            name,
            usage: `${name} [amount]`,
            description
        }
    };
}

module.exports = [
    makeCommand('purge', 'Purged', 'Deletes a certain number of messages', () => true),
    makeCommand('prune', 'Pruned', 'Deletes a certain number of messages sent by you', (msg, bot) => msg.author.id === bot.user.id),
    makeCommand('flush', 'Flushed', 'Deletes a certain number of messages sent by bots', msg => msg.author.bot)
];

function makeCommand(name, viewName, description, filter) {
    return {
        run: async (bot, msg, args) => {
            let count = parseInt(args[0]) || 1;

            msg.delete();

            const messages = await msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id });
            const deletable = messages.filter(message => filter(message, bot));

            await Promise.all(
                deletable.map(m => m.delete())
            );

            const deleted = deletable.size;

            (await msg.channel.send(`:white_check_mark: ${viewName} \`${deletable.size}\` message${deleted === 1 ? '' : 's'}.`)).delete(2000);
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

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        return bot.db.entries().then(entries => {
            let tags = entries
                .filter(e => e.key.startsWith('tags.'))
                .map(e => e.value)
                .sort((a, b) => b.used - a.used);

            msg.edit(`${tags.map(tag => `**${tag.name}** (${tag.used})`).join('\n')}`, { split: true });
        });
    }


};

exports.info = {
    name: 'tags',
    usage: 'tags [add|delete] [id]',
    description: 'Lists all saved tags'
};

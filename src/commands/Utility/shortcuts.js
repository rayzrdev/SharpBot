exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        return bot.db.entries().then(entries => {
            let shortcuts = entries.filter(e => e.key.startsWith('shortcuts.')).map(e => e.value);
            if (shortcuts.length < 1) {
                throw 'You have no shortcuts!';
            }
            msg.edit(shortcuts.map(sc => `**${sc.name}:** \`${sc.command}\``).join('\n')).then(m => m.delete(15000));
        });
    }

    if (/a(dd)?|c(reate)?/i.test(args[0])) {
        if (args.length < 3) {
            throw `Usage: \`${bot.config.prefix}shortcut add <id> <command>\``;
        }
        let id = args[1].toLowerCase();
        let command = args.slice(2).join(' ');
        bot.db.get(`shortcuts.${id}`).then(sc => {
            if (sc) {
                throw `The shortcut \`${id}\` already exists!`;
            }
            bot.db.put(`shortcuts.${id}`, { name: id, command }).then(() => {
                msg.edit(`:white_check_mark: Created shortcut \`${id}\`!`).then(m => m.delete(2000));
            });
        });
    } else if (/d(el(ete)?)?|r(em(ove)?)?/i.test(args[0])) {
        if (args.length < 2) {
            throw `Usage: \`${bot.config.prefix}shortcut remove <id>\``;
        }
        let id = args[1];
        bot.db.delete(`shortcuts.${id}`).then(() => {
            msg.edit(`:white_check_mark: Removed the shortcut \`${id}\``).then(m => m.delete(2000));
        });
    } else {
        bot.commands.get('help').run(bot, msg, ['shortcuts']);
    }
};

exports.info = {
    name: 'shortcuts',
    usage: 'shortcuts [add|delete] [id]',
    description: 'Controls or lists your shortcuts'
};

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        return bot.db.entries().then(entries => {
            var shortcuts = entries.filter(e => e.key.startsWith('shortcuts.')).map(e => e.value);

            msg.edit(shortcuts.map(sc => `**${sc.name}:** \`${sc.command}\``).join('\n')).then(m => m.delete(5000));
        });
    }

    if (/a(dd)?|c(reate)?/i.test(args[0])) {
        if (args.length < 3) {
            return msg.edit(`:no_entry_sign: Usage: \`${bot.config.prefix}shortcut add <id> <command>\``).then(m => m.delete(2000));
        }
        let id = args[1];
        var command = args.slice(2).join(' ');
        bot.db.get(`shortcuts.${id}`).then(sc => {
            if (sc) {
                return msg.edit(`:no_entry_sign: The shortcut \`${id}\` already exists!`).then(m => m.delete(2000));
            }
            bot.db.put(`shortcuts.${id}`, { name: id, command }).then(() => {
                msg.edit(`:white_check_mark: Created shortcut \`${id}\`!`).then(m => m.delete(2000));
            });
        });
    } else if (/d(el(ete)?)?|r(em(ove)?)?/i.test(args[0])) {
        if (args.length < 2) {
            return msg.edit(`:no_entry_sign: Usage: \`${bot.config.prefix}shortcut remove <id>\``).then(m => m.delete(2000));
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
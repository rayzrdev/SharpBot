exports.init = bot => {
    this.storage = bot.storage('shortcuts');
};

const ADD = /^a(dd)?|c(reate)?$/i;
const EDIT = /^e(dit)?$/i;
const DELETE = /^d(el(ete)?)?|r(em(ove)?)?$/i;
const INFO = /^i(nfo)?$/i;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        const shortcuts = this.storage.values;

        if (shortcuts.length < 1) {
            throw 'You have no shortcuts!';
        }

        const list = shortcuts.map(shortcut => `- \`${shortcut.name}\``).join('\n');

        msg.delete();
        return bot.utils.sendLarge(msg.channel, `**Shortcuts:**\n${list}`, { cutOn: '\n' });
    }

    if (ADD.test(args[0]) || EDIT.test(args[0])) {
        if (args.length < 3) {
            throw `Usage: \`${bot.config.prefix}shortcut add|edit <id> <command>\``;
        }

        let id = args[1].toLowerCase();
        let command = args.slice(2).join(' ');

        // People keep accidentally putting their command prefix in
        if (command.startsWith(bot.config.prefix)) {
            command = command.substr(bot.config.prefix.length);
        }

        const shortcut = this.storage.get(id);
        if (shortcut && !EDIT.test(args[0])) {
            throw `The shortcut \`${id}\` already exists!`;
        }

        this.storage.set(id, { name: id, command });
        this.storage.save();

        msg.edit(`:white_check_mark: Created shortcut \`${id}\`.`)
            .then(m => m.delete(5000));
    } else if (DELETE.test(args[0])) {
        if (args.length < 2) {
            throw `Usage: \`${bot.config.prefix}shortcut delete <id>\``;
        }

        let id = args[1];

        const shortcut = this.storage.get(id);
        if (!shortcut) {
            throw `The shortcut \`${id}\` doesn't exist!`;
        }

        this.storage.set(id);
        this.storage.save();

        msg.edit(`:white_check_mark: Removed the shortcut \`${id}\`.`)
            .then(m => m.delete(5000));
    } else if (INFO.test(args[0])) {
        if (args.length < 2) {
            throw `Usage: \`${bot.config.prefix}shortcut info <name>\``;
        }

        const id = args[1];
        const shortcut = this.storage.get(id);

        if (!shortcut) {
            throw `The shortcut \`${id}\` doesn't exist!`;
        }

        msg.edit(`**Name:** \`${shortcut.name}\`\n\`\`\`xl\n${shortcut.command}\n\`\`\``)
            .then(m => m.delete(30000));
    } else {
        bot.commands.get('help').run(bot, msg, ['shortcuts']);
    }
};

exports.info = {
    name: 'shortcuts',
    usage: 'shortcuts [add <name> <command>|edit <name> <command>|delete <name>|info <name>]',
    description: 'Controls or lists your shortcuts',
    examples: [
        'shortcuts add love embed -c #ff0000 <3',
        'shortcuts edit drpg say #!mine;; say #!forage;; say #!chop;; say #!fish',
        'shortcuts delete invite',
        'shortcuts info love',
        'shortcuts'
    ]
};

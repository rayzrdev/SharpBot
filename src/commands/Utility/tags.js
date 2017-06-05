exports.init = bot => {
    this.storage = bot.storage('tags');
};

exports.run = (bot, message, args) => {
    if (args.length < 1) {
        throw `Do \`${bot.config.prefix}help tag\` for info on how to use this command.`;
    }

    const sub = args[0].toLowerCase();
    args = args.slice(1);

    if (sub === 'list') {
        const tags = this.storage.values
            .sort((a, b) => b.used - a.used);

        message.edit(`${tags.map(tag => `**${tag.name}** (${tag.used})`).join('\n')}`, { split: true });
    } else if (sub === 'add') {
        if (args.length < 2) {
            throw 'You must provide a tag name and the tag contents!';
        }

        let name = args[0];
        let contents = args.slice(1).join(' ');

        const tag = this.storage.get(name);
        if (tag) {
            throw 'That tag already exists!';
        }

        this.storage.set(name, { name, contents, used: 0 });
        this.storage.save();

        message.edit(`:white_check_mark: The tag \`${name}\` was added.`)
            .then(m => m.delete(5000));
    } else if (sub === 'delete') {
        if (args.length < 1) {
            throw 'You must provide a tag name to delete!';
        }

        const name = args[0];

        if (!this.storage.get(name)) {
            throw 'That tag does not exist!';
        }

        this.storage.set(name);
        this.storage.save();

        message.edit(`:white_check_mark: The tag \`${name}\` was deleted.`)
            .then(m => m.delete(5000));
    } else {
        const tag = this.storage.get(sub);

        if (!tag) {
            throw 'That tag does not exist!';
        }

        message.edit(args.join(' ') + tag.contents);

        tag.used++;

        this.storage.set(sub, tag);
        this.storage.save();
    }
};

exports.info = {
    name: 'tag',
    usage: 'tag <name>|list|add <name> <content>|delete <name>',
    description: 'Manages your tags'
};

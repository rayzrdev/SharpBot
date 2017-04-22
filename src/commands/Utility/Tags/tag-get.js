exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        return msg.edit(':no_entry_sign: You must provide a tag name!').then(m => m.delete(2000));
    }

    bot.db.get(`tags.${args[0]}`).then(tag => {
        if (!tag) {
            return msg.edit(`:no_entry_sign: The tag '${args[0]}' does not exist.`).then(m => m.delete(2000));
        }

        msg.edit(args.slice(1).join(' ') + tag.contents);

        tag.used++;
        bot.db.put(`tags.${args[0]}`, tag).catch(bot.logger.severe);
    });
};

exports.info = {
    name: 'tag',
    usage: 'tag <tag>',
    description: 'Displays a saved tag'
};

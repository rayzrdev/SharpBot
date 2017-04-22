exports.run = (bot, msg, args) => {
    if (args.length < 2) {
        return msg.edit(':no_entry_sign: You must provide a tag name and contents!').then(m => m.delete(2000));
    }

    let name = args[0];
    let contents = args.slice(1).join(' ');

    bot.db.get(`tags.${args[0]}`).then(tag => {
        if (tag) {
            return msg.edit(':no_entry_sign: That tag already exists!').then(m => m.delete(2000));
        }
        bot.db.put(`tags.${args[0]}`, { name, contents, used: 0 }).then(() => {
            msg.edit(`:white_check_mark: The tag \`${name}\` was added.`).then(m => m.delete(2000));
        });
    });
};

exports.info = {
    name: 'addtag',
    usage: 'addtag <tag> <text>',
    description: 'Adds a tag'
};

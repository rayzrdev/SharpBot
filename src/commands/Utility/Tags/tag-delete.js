exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        return msg.edit(':no_entry_sign: You must provide a tag name!').then(m => m.delete(2000));
    }

    bot.db.delete(`tags.${args[0]}`).then(() => {
        msg.edit(`:white_check_mark: The tag \`${args[0]}\` has been deleted.`).then(m => m.delete(2000));
    }).catch(err => msg.edit(`Failed to remove the tag \`${args[0]}\`: \`${err}\``).then(m => m.delete(2000)));
};

exports.info = {
    name: 'deltag',
    usage: 'deltag <tag>',
    description: 'Deletes a saved tag'
};

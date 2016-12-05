exports.run = function (bot, msg, args) {
    bot.db.run(`DELETE FROM tags WHERE name = '${args[0]}'`).then(() => {
        msg.edit(`:white_check_mark: The tag ${args[0]} has been deleted`).then(m => m.delete(1000));
    }).catch(() => msg.edit(`Failed to remove the tag ${args[0]}`).then(m => m.delete(1000)));
};

exports.info = {
    name: 'deltag',
    usage: 'deltag <tag>',
    description: 'Deletes a saved tag'
};
exports.run = function(bot, msg, args) {
    bot.db.get(`SELECT * FROM tags WHERE name = '${args[0]}'`).then(row => {
        if (row) {
            let message_content = msg.mentions.users.array().length === 1 ? `${msg.mentions.users.array()[0]} ${row.contents}` : row.contents;
            setTimeout(() => {
                msg.edit(message_content);
            }, 20);
            bot.db.run(`UPDATE tags SET used = used+1 WHERE name = '${args[0]}'`);
        }
        else msg.edit('You derp, that tag doesn\'t exist. Go back to school!').then(m => m.delete(1000));
    });
};

exports.info = {
    name: 'tag',
    usage: 'tag <tag>',
    description: 'Displays a saved tag'
};
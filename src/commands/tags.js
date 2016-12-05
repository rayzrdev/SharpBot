exports.run = function(bot, msg) {
    bot.db.all('SELECT * FROM tags').then(rows => {
        msg.edit(`List of tags: ${rows.map(r => `${r.name} (${r.used})`).join(' ; ')}`);
    });
};

exports.info = {
    name: 'tags',
    usage: 'tags',
    description: 'Lists all saved tags'
};
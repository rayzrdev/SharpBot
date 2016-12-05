exports.run = function (bot, msg, args) {
    let name = args[0];
    let contents = args.slice(1).join(' ');
    bot.db.get(`SELECT * FROM tags WHERE name = '${args[0]}'`).then(row => {
        if (!row) {
            bot.db.run('INSERT INTO \'tags\' (name, contents) VALUES (?, ?)', [name, contents]).then(() => {
                msg.edit(':white_check_mark: Tag was added: ' + name).then(m => m.delete(1000));
            });
        }
        else msg.edit('Derp, that tag already exists').then(m => m.delete(1000));
    });
};

exports.info = {
    name: 'addtag',
    usage: 'addtag <tag> <text>',
    description: 'Adds a tag'
};
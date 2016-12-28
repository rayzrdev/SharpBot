exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must specify what to search for.')
            .then(m => m.delete(2000));
        return;
    }

    var query = args.join(' ');

    msg.edit(`:arrows_counterclockwise: Searching the last \`100\` messages for \`${query}\``)
        .then(m => {

            msg.channel.fetchMessages({ limit: 100, before: msg.id })
                .then(messages => {
                    var results = messages.filter(it => it.content.toLowerCase().indexOf(query.toLowerCase()) != -1);
                    var output = results
                        .map(it => `[${it.createdAt.getDay()}/${it.createdAt.getMonth()}/${it.createdAt.getYear() + 1900} ${it.createdAt.getHours()}:${it.createdAt.getMinutes()}:${it.createdAt.getSeconds()}] [${it.author.username}] ${it.content}`)
                        .join('\n');
                    console.log(output);
                    m.editCode('log', output);

                }).catch(err => {
                    console.error(err);
                    m.edit(':no_entry_sign:');
                });

        });

};

exports.info = {
    name: 'search',
    usage: 'search <# of messages> <search text>',
    description: 'Searches a certain number of messages for the given search text'
};
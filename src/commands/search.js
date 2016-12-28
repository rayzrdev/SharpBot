exports.run = function (bot, msg, args) {
    if (args.length < 2) {
        msg.edit(':no_entry_sign: You must specify a number of messages, as well as what to search for.')
            .then(m => m.delete(2000));
        return;
    }

    var count = Math.min(Math.max(parseInt(args[0]), 1), 100);
    var query = args.splice(1).join(' ');

    msg.edit(`:arrows_counterclockwise: Searching the last \`${count}\` messages for \`${query}\``)
        .then(m => {

            msg.channel.fetchMessages({ limit: count, before: msg.id })
                .then(messages => {
                    var results = messages.filter(it => it.content.toLowerCase().indexOf(query.toLowerCase()) != -1);
                    var output = results
                        .map(it => `[${it.createdAt.getDay()}/${it.createdAt.getMonth()}/${it.createdAt.getYear() + 1900} ${it.createdAt.getHours()}:${it.createdAt.getMinutes()}:${it.createdAt.getSeconds()}] ${it.content}`)
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
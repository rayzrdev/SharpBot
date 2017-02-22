function formatDate(date) {
    return `[${_(date.getDay())}/${_(date.getMonth())}/${_(date.getYear() - 100)}] [${_(date.getHours())}:${_(date.getMinutes())}:${_(date.getSeconds())}]`;
}

function _(number) {
    return number < 10 ? '0' + number : '' + number;
}

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
                        .map(it => `${formatDate(it.createdAt)} ${it.author.username}: ${it.content}`)
                        .join('\n');
                    m.editCode('log', output);

                }).catch(err => {
                    console.error(err);
                    m.edit(':no_entry_sign:');
                });

        });

};

exports.info = {
    name: 'search',
    usage: 'search <#> <text>',
    description: 'Searches a number of messages for some text'
};
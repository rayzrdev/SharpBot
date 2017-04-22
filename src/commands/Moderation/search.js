exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify what to search for!';
    }

    let query = args.join(' ');

    msg.edit(`:arrows_counterclockwise: Searching the last \`100\` messages for \`${query}\``)
        .then(m => {

            msg.channel.fetchMessages({ limit: 100, before: msg.id })
                .then(messages => {
                    let results = messages.filter(it => it.content.toLowerCase().indexOf(query.toLowerCase()) != -1);
                    let output = results
                        .map(it => `${formatDate(it.createdAt)} ${it.author.username}: ${it.content}`)
                        .join('\n');
                    m.editCode('log', output);

                }).catch(msg.error);
        });

};

function formatDate(date) {
    return `[${_(date.getDay())}/${_(date.getMonth())}/${_(date.getYear() - 100)}] [${_(date.getHours())}:${_(date.getMinutes())}:${_(date.getSeconds())}]`;
}

function _(number) {
    return number < 10 ? '0' + number : '' + number;
}

exports.info = {
    name: 'search',
    usage: 'search <#> <text>',
    description: 'Searches a number of messages for some text'
};

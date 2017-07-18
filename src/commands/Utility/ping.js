exports.run = async (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['o']);

    if (parsed.options.o) {
        return msg.edit(':stopwatch: Ping').then(m => {
            let time = msg.editedTimestamp - msg.createdTimestamp;
            bot.utils.playAnimation(m, 500, [
                ':stopwatch: __P__ing',
                ':stopwatch: __Pi__ng',
                ':stopwatch: __Pin__g',
                ':stopwatch: __Ping__',
                `:stopwatch: ***Pong!*** \`${time}ms\``
            ]);
        });
    }

    await msg.edit(':thinking: Ping');

    const delay = msg.editedTimestamp - msg.createdTimestamp;

    (await msg.edit(`:stopwatch: Pong! \`${delay}ms\``)).delete(5000);
};

exports.info = {
    name: 'ping',
    usage: 'ping [-o]',
    description: 'Pings the bot',
    options: [
        {
            name: '-o',
            usage: '-o',
            description: 'Shows the old ping message (animated)'
        }
    ]
};

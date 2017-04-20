exports.run = (bot, msg) => {
    msg.edit(':stopwatch: Ping').then(m => {
        let time = msg.editedTimestamp - msg.createdTimestamp;
        bot.utils.playAnimation(m, 500, [
            ':stopwatch: __P__ing',
            ':stopwatch: __Pi__ng',
            ':stopwatch: __Pin__g',
            ':stopwatch: __Ping__',
            `:stopwatch: ***Pong!*** \`${time}ms\``
        ]);
    });
};

exports.info = {
    name: 'ping',
    usage: 'ping',
    description: 'Pings the bot'
};
exports.run = function (bot, msg, args) {
    let parsed = bot.utils.parseArgs(args, ['t:']);
    let time = 5000;

    if(parsed.options.t) {
        time = parsed.options.t;
    }

    msg.edit(parsed.leftover.join(' ')).then(m => m.delete(time));
};

exports.info = {
    name: 'selfdestruct',
    usage: 'selfdestruct <message> [-t time]',
    description: 'Deletes the message after a specified time, 5 seconds if not specified',
    options: [
        {
            name: '-t',
            usage: '-t <time>',
            description: 'Sets the time for the message to be deleted'
        }
    ]
};

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must put something to say!';
    }

    msg.delete();
    msg.channel.send(args.join(' '));
};

exports.info = {
    name: 'say',
    usage: 'say <message>',
    description: 'Says the message you put. Useful for shortcuts.'
};

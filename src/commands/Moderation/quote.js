exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide a message ID!';
    }

    if (!/^\d+$/.test(args[0])) {
        throw 'Invalid message ID! It should only contain numbers.';
    }

    msg.delete();

    msg.channel.fetchMessages({ around: args[0], limit: 1 })
        .then(messages => {
            if (!messages || messages.size < 1) {
                return msg.error('That message could not be found!');
            } else {
                var message = messages.first();

                var options = {
                    timestamp: message.editedTimestamp || message.createdTimestamp,
                    footer: false
                };
                var attachment = message.attachments.first();

                if (attachment && (attachment.width || attachment.height)) {
                    options.image = attachment.url;
                }

                msg.channel.sendEmbed(
                    bot.utils.embed('', message.toString(), [], options)
                        .setAuthor(message.author.username, message.author.avatarURL)
                );
            }
        }).catch(() => msg.error('That message could not be found!'));
};

exports.info = {
    name: 'quote',
    usage: 'quote <id>',
    description: 'Quotes the message with the given ID'
};
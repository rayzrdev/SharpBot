exports.run = (bot, msg, args) => {
    let ch = msg.channel;
    let cch = false;
    if (args.length < 1) {
        throw 'You must provide a message ID';
    }

    if (!/^\d{18}$/.test(args[0])) {
        throw 'You must provide a valid message ID.';
    } else if (/^<#\d{18}>$|^\d{18}$/.test(args[1])) {
        ch = bot.channels.get(args[1].replace('<#', '').replace('>', ''));
        cch = true;
    }

    msg.delete();

    ch.fetchMessages({ around: args[0], limit: 1 })
        .then(messages => {
            if (!messages || messages.size < 1) {
                return msg.error('That message could not be found!');
            } else {
                let message = messages.first();

                let options = {
                    timestamp: message.editedTimestamp || message.createdTimestamp,
                    footer: false
                };
                let attachment = message.attachments.first();

                if (attachment && (attachment.width || attachment.height)) {
                    options.image = attachment.url;
                }

                let field = '';

                if (cch) {
                    field = `**in: <#${ch.id}>:**`;
                }
                if (msg.guild.id !== ch.guild.id) {
                    field = `**in: ${ch.guild.name}/<#${ch.id}>:**`;
                }

                msg.channel.send({
                    embed: bot.utils.embed('', field + '\n\n' + message.toString(), [], options)
                        .setAuthor(message.author.username, message.author.avatarURL)
                        // .setTitle(field)
                });
            }
        }).catch(() => msg.error('That message could not be found!'));
};

exports.info = {
    name: 'quote',
    usage: 'quote <id> [#channel | channel ID]',
    description: 'Quotes the message with the given ID and channel ID.'
};

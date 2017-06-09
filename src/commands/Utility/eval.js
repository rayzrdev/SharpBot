const stripIndents = require('common-tags').stripIndents;
exports.run = (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['l:', 'i']);
    let lang = parsed.options.l || '';

    let code = parsed.leftover.join(' ');

    try {
        let evaled = eval(code);
        if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
            if (!lang) {
                lang = 'javascript';
            }
        }
        msg.delete();
        let output = clean(evaled).replace(bot.token, 'BOT_TOKEN' + String.fromCharCode(8203));

        bot.utils.hastebinUpload(output).then(({url}) => {
            if (!url) {
                return 'Failed to upload, no key was returned!';
            }
            msg.channel.send({
                embed: bot.utils.embed('', stripIndents`
                **Input:**\n\`\`\`js\n${code}\n\`\`\`
                **Output:**${output.length < 1500 ? `\n\`\`\`${lang}\n${output}\n\`\`\`` : `\n${url}\n`}
            `)});

            if (output.length > 1500 && parsed.options.i) {
                bot.utils.sendLarge(msg.channel, output, {
                    prefix: '```' + lang + '\n',
                    suffix: '```',
                    cutOn: ',',
                    cutAfter: true
                });
            }
        });
    } catch (err) {
        msg.delete();
        msg.channel.send({
            embed: bot.utils.embed('', `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n:x: **Error!**\n\`\`\`xl\n${clean(err)}\n\`\`\``, [], {
                color: '#ff0000'
            })}).then(m => m.delete(15000));
    }
};

function clean(text) {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    }
    else {
        return text;
    }
}

exports.info = {
    name: 'eval',
    usage: 'eval <code>',
    description: 'Evaluates arbitrary JavaScript',
    options: [
        {
            name: '-l',
            usage: '-l <lang>',
            description: 'Sets the output code-block syntax language'
        },
        {
            name: '-i',
            usage: '-i',
            description: 'Inline extra-long output in addition to uploading to hastebin'
        }
    ]
};

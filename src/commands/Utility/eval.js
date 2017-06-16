const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['l:', 'i']);
    let lang = parsed.options.l || '';

    let code = parsed.leftover.join(' ');
    let output;

    Promise.resolve(eval(code)).then(evaled => {
        if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
            if (!lang) {
                lang = 'javascript';
            }
        }

        msg.delete();
        output = clean(evaled).replace(new RegExp(RegExp.quote(bot.token), 'g'), 'BOT_TOKEN');

        return bot.utils.gistUpload(output);
    }).then(({ url }) => {
        if (!url) {
            return 'Failed to upload!';
        }

        msg.channel.send({
            embed: bot.utils.embed('', stripIndents`
                **Input:**\n\`\`\`js\n${code}\n\`\`\`
                **Output:**${output.length < 1500 ? `\n\`\`\`${lang}\n${output}\n\`\`\`` : `\n${url}\n`}
                `)
        });

        if (output.length > 1500 && parsed.options.i) {
            bot.utils.sendLarge(msg.channel, output, {
                prefix: '```' + lang + '\n',
                suffix: '```',
                cutOn: ',',
                cutAfter: true
            });
        }
    }).catch(err => {
        if (err.response && err.response.body.message) {
            err = err.response.body.message;
        }
        errorHandler(msg, bot, code, err);
    });
};

function errorHandler(msg, bot, code, err) {
    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed('', `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n:x: **Error!**\n\`\`\`xl\n${clean(err)}\n\`\`\``, [], {
            color: '#ff0000'
        })
    }).then(m => m.delete(15000));
}

// Prevent @mentions, #channels or code blocks inside code blocks.
function clean(text) {
    return text.replace(/([`@#])/g, '$1\u200b');
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

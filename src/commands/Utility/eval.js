const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['l:', 'i', 'q']);
    let lang = parsed.options.l || '';

    let code = parsed.leftover.join(' ');
    let output;

    try {
        output = await eval(code);
    } catch (err) {
        let message = err;
        if (err && err.response && err.response.body && err.response.body.message) {
            message = err.response.body.message;
        }

        return errorHandler(msg, bot, code, `${message}`);
    }

    msg.delete();

    if (parsed.options.q) {
        return;
    }

    if (typeof output !== 'string') {
        output = require('util').inspect(output);
    }

    if (!lang) {
        lang = 'javascript';
    }

    output = clean(output).replace(new RegExp(bot.utils.quoteRegex(bot.token), 'g'), 'BOT_TOKEN');

    const displayedOutput = output.length < 1500
        ? `\n\`\`\`${lang}\n${output}\n\`\`\``
        : `\n${await tryUpload(bot, output)}\n`;

    msg.channel.send({
        embed: bot.utils.embed('', stripIndents`
                **Input:**\n\`\`\`js\n${code}\n\`\`\`
                **Output:**${displayedOutput}
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
};

const tryUpload = async (bot, content) => {
    const { url } = await bot.utils.textUpload(content);
    if (!url) {
        throw 'Failed to upload!';
    }
    return url;
};

const errorHandler = (msg, bot, code, err) => {
    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed('', `**Input:**\n\`\`\`js\n${code}\n\`\`\`\n:x: **Error!**\n\`\`\`xl\n${clean(err)}\n\`\`\``, [], {
            color: '#ff0000'
        })
    }).then(m => m.delete(15000));
};

// Prevent @mentions, #channels or code blocks inside code blocks.
const clean = text => text.replace(/([`@#])/g, '$1\u200b');

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
        },
        {
            name: '-q',
            usage: '-q',
            description: 'Does not print any output'
        }
    ]
};

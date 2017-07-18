const translate = require('google-translate-api');
const stripIndents = require('common-tags').stripIndents;

exports.run = async (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['e', 'f:']);

    if (parsed.leftover.length < 2) {
        throw 'You must provide a language and some text to translate!';
    }

    let lang = parsed.leftover[0];
    let input = parsed.leftover.slice(1).join(' ');

    await msg.edit(':arrows_counterclockwise: **Translating your Text...**');
    let res;

    try {
        res = await translate(input, { from: parsed.options.f, to: lang });
    } catch (e) {
        return msg.error(`Failed to translate: ${e.message}`);
    }

    if (parsed.options.e) {
        return msg.edit(res.text);
    }

    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed('', stripIndents`
            **From:** __\`${parsed.options.f || '[auto]'}\`__
            **To:** __\`${lang}\`__

            **Input:**\n\`\`\`\n${input}\n\`\`\`
            **Output:**\n\`\`\`\n${res.text}\n\`\`\`
        `)
    });
};

exports.info = {
    name: 'translate',
    usage: 'translate <lang> <text>',
    description: 'Translates text from/to any language',
    credits: 'Carbowix',
    options: [
        {
            name: '-e',
            description: 'Edits your message with the translation instead of showing an embed'
        },
        {
            name: '-f',
            usage: '-f <language>',
            description: 'Sets the `from` language, this is `auto` by default'
        }
    ]
};

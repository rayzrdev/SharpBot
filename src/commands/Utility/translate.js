const translate = require('google-translate-api');
const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    if (args.length < 2) {
        throw 'You must provide a language and some text to translate!';
    }

    let parsed = bot.utils.parseArgs(args, ['e', 'f:']);

    let lang = parsed.leftover[0];
    let input = parsed.leftover.slice(1).join(' ');

    msg.edit(':arrows_counterclockwise: **Translating your Text...**').then(() => {
        translate(input, { from: parsed.options.f, to: lang }).then(res => {
            if (parsed.options.e) msg.edit(res.text);
            else {
                msg.delete();
                msg.channel.sendEmbed(
                    bot.utils.embed('', stripIndents`
                **From:** __\`${parsed.options.f || '[auto]'}\`__
                **To:** __\`${lang}\`__

                **Input:**\n\`\`\`\n${input}\n\`\`\`
                **Output:**\n\`\`\`\n${res.text}\n\`\`\`
                `)
                );
            }
        }).catch(msg.error);
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

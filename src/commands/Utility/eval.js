const got = require('got');
const url = require('url');
const stripIndents = require('common-tags').stripIndents;
exports.run = (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['l:']);
    let lang = parsed.options.l || '';

    let code = parsed.leftover.join(' ');

    try {
        let evaled = eval(code);
        if (typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled);
        }
        msg.delete();
        let output = clean(evaled).replace(bot.token, 'BOT_TOKEN' + String.fromCharCode(8203));
        got.post(url.resolve('https://hastebin.com', 'documents'), {
            body: output,
            json: true,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(res => {
            if (!res.body || !res.body.key) {
                return 'Failed to upload, no key was returned!';
            }
            let output2 = res.body.key || res.body;
            msg.channel.send({
                embed: bot.utils.embed('', stripIndents`
                **Input:**\n\`\`\`js\n${code}\n\`\`\`
                **Output:**${evaled.split('').length < 1900 ? `\n\`\`\`${lang}\n${output}\n\`\`\`` : `\nhttps://hastebin.com/${output2}\n`}
            `)});
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
        }
    ]
};

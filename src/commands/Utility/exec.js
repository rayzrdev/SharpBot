const { exec } = require('child_process');
const username = require('os').userInfo().username;

exports.run = async (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['r', 'd', 's', 'f', 'w', 'fn:', 'l:']);

    if (parsed.length < 1) {
        throw 'You must provide a command to run!';
    }

    if (parsed.options.d) {
        msg.delete();
    }

    let ps = exec(parsed.leftover.join(' '));
    if (!ps) {
        throw 'Failed to start process!';
    }

    if (parsed.options.s) {
        return;
    }

    let opts = {
        delay: 10,
        cutOn: '\n'
    };

    if (!parsed.options.r) {
        opts.prefix = `\`\`\`${parsed.options.l || 'bash'}\n`;
        opts.suffix = '\n```';
    }

    if (parsed.options.f) {
        let output = '';

        ps.stdout.on('data', data => output += data.toString());
        await new Promise(resolve => {
            ps.once('exit', async () => {
                if (!output) {
                    return resolve();
                }

                try {
                    await msg.channel.send({
                        files: [
                            {
                                attachment: output.replace(/^file:\/\//, ''),
                                name: parsed.options.fn
                            }
                        ]
                    });
                } catch (err) {
                    msg.error('Invalid URL/path!');
                }

                resolve();
            });
        });
    } else {
        if (parsed.options.w) {
            let output = '';
            let handler = data => output += data.toString();

            [ps.stdout, ps.stderr].forEach(stream => stream.on('data', handler));

            await new Promise(resolve => {
                ps.once('exit', async () => {
                    if (!output) {
                        return resolve();
                    }

                    await bot.utils.sendLarge(msg.channel, clean(output), opts);

                    resolve();
                });
            });
        } else {
            ps.stdout.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));
            ps.stderr.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));

            await new Promise(resolve => ps.once('exit', resolve));
        }
    }
};

const clean = function (data) {
    return `${data}`
        .replace(/`/g, '\u200b$&')
        .replace(new RegExp(username, 'g'), '<Hidden>')
        .replace(/\[[0-9]*m/g, '');
};

exports.info = {
    name: 'exec',
    usage: 'exec <command>',
    description: 'Executes a command in the console',
    options: [
        {
            name: '-s',
            description: 'Runs in silent mode, not showing any console output'
        },
        {
            name: '-l',
            usage: '-l <lang>',
            description: 'Sets the language of the outputted code block'
        },
        {
            name: '-r',
            description: 'Sends the output raw, without any code blocks'
        },
        {
            name: '-d',
            description: 'Deletes the command message'
        },
        {
            name: '-f',
            description: 'Interperts the response as a file URL/path to send'
        },
        {
            name: '-fn',
            usage: '-fn <name>',
            description: 'Sets the name for the sent file'
        },
        {
            name: '-w',
            description: 'Wait for the program to finish before sending the output'
        }
    ]
};

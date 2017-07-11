const { exec } = require('child_process');
const username = require('os').userInfo().username;

exports.run = (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, 's', 'l:');

    if (parsed.length < 1) {
        throw 'You must provide a command to run!';
    }

    let ps = exec(parsed.leftover.join(' '));
    if (!ps) {
        throw 'Failed to start process!';
    }

    if (parsed.options.s) {
        return;
    }

    let opts = {
        prefix: `\`\`\`${parsed.options.l || 'bash'}\n`,
        suffix: '\n```',
        delay: 10,
        cutOn: '\n'
    };

    ps.stdout.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));
    ps.stderr.on('data', data => bot.utils.sendLarge(msg.channel, clean(data), opts));
};

const clean = function (data) {
    return `${data}`
        .replace(/`/g, '\\$&')
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
        }
    ]
};

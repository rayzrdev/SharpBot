const { exec } = require('child_process');
const username = require('os').userInfo().username;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide a command to run!';
    }

    let parsed = bot.utils.parseArgs(args, 'l:');

    let ps = exec(parsed.leftover.join(' '));
    if (!ps) {
        throw 'Failed to start process!';
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
    return data.toString()
        .replace(new RegExp(username, 'g'), '<Hidden>')
        .replace(/\[[0-9]*m/g, '');
};

exports.info = {
    name: 'exec',
    usage: 'exec [-l <lang>] <command>',
    description: 'Executes a command in the console'
};

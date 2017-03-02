const {exec} = require('child_process');
const username = require('os').userInfo().username;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide a command to run!';
    }

    var lang = 'bash';
    if (args[0] === '-l' || args[0] === '--lang') {
        args.shift();
        lang = args.shift();
    }

    var ps = exec(args.join(' '));

    var opts = {
        prefix: `\`\`\`${lang}\n`,
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
    usage: 'exec <command>',
    description: 'Executes a command in the console'
};
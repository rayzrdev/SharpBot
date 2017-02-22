const {exec} = require('child_process');
const username = require('os').userInfo().username;
const utils = require('../utils');
const yargs = require('yargs');

const clean = function (data) {
    return data.toString()
        .replace(new RegExp(username, 'g'), '<Hidden>')
        .replace(/\[[0-9]*m/g, '');
};

exports.run = (bot, msg, args) => {
    var lang = 'bash';
    if (args[0] === '-l' || args[0] === '--lang') {
        args.shift();
        lang = args.shift();
    }

    if (args.length < 1) {
        return msg.edit(':no_entry_sign: You must provide a command to run!').then(m => m.delete(2000));
    }

    var ps = exec(args.join(' '));

    var opts = {
        prefix: `\`\`\`${lang}\n`,
        suffix: '\n```',
        delay: 10,
        cutOn: '\n'
    };

    ps.stdout.on('data', data => utils.sendLarge(msg.channel, clean(data), opts));
    ps.stderr.on('data', data => utils.sendLarge(msg.channel, clean(data), opts));
};

exports.info = {
    name: 'exec',
    usage: 'exec <command>',
    description: 'Executes a command in the console'
};
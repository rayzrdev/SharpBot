const {exec} = require('child_process');
const username = require('os').userInfo().username;

const clean = function (data) {
    return data.toString()
        .replace(new RegExp(username, 'g'), '<Hidden>')
        .replace(/\[[0-9]*m/g, '');
};

exports.run = (bot, msg, args) => {
    var ps = exec(args.join(' '));
    ps.stdout.on('data', data => msg.channel.sendCode('diff', clean(data)));
    ps.stderr.on('data', data => msg.channel.sendCode('diff', clean(data)));
};

exports.info = {
    name: 'exec',
    usage: 'exec <command>',
    description: 'Executes a command in the console'
};
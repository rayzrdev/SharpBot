const {exec} = require('child_process');

exports.run = (bot, msg, args) => {
    var ps = exec(args.join(' '));
    ps.stdout.on('data', data => msg.channel.sendCode('diff', data.toString()));
    ps.stderr.on('data', data => msg.channel.sendCode('diff', data.toString()));
};

exports.info = {
    name: 'exec',
    usage: 'exec <command>',
    description: 'Executes a command in the console'
};
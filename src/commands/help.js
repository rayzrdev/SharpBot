const utils = require('../utils');

const getHelp = function (bot, command) {
    return {
        name: `\`${command.info.name}\``,
        value: `Usage: \`${bot.config.prefix}${command.info.usage}\`\nDescription: ${command.info.description}`
    };
};

exports.run = function (bot, msg, args) {

    var commands = bot.commands;
    if (args.length > 0) {
        let command = bot.commands[args[0]];
        if (!command) {
            msg.edit(`:no_entry_sign: The command '${args[0]}' does not exist!`).then(m => m.delete(2000));
            return;
        }
        commands = [command];
    }

    var fields = [];
    for (const cmd in commands) {
        fields.push(getHelp(bot, commands[cmd]));
    }

    msg.edit('', {
        embed: utils.embed('Commands', 'This message will dissappear in 10 seconds.', fields)
    }).then(m => m.delete(10000));
};

exports.info = {
    name: 'help',
    usage: 'help [command]',
    description: 'Shows you help for all commands or just a single command'
};
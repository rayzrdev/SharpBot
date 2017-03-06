const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {

    var commands = [];
    var title = 'Categories';

    if (args.length > 0) {
        if (/c(ategory)?|t(ype)?/i.test(args[0])) {
            if (args.length < 2) {
                throw 'You must specify a category!';
            }
            commands = bot.commands.all(args[1]);
            title = `${args[1]} Commands`;
        } else if (/a(ll)?/i.test(args[0])) {
            commands = bot.commands.all();
            title = 'All Commands';
        } else {
            let command = bot.commands.get(args[0]);
            if (!command) {
                throw `The command '${args[0]}' does not exist!`;
            }

            commands = [command];
            title = `Help for \`${command.info.name}\``;
        }
    }

    if (commands.length > 0) {
        var fields = commands.filter(c => !c.info.hidden).sort((a, b) => a.info.name.localeCompare(b.info.name)).map(c => getHelp(bot, c));

        msg.editEmbed(
            bot.utils.embed(title, '_This message will self-destruct in 30 seconds._', fields)
        ).then(m => m.delete(30000));
    } else {
        var categories = bot.commands.categories().sort();
        msg.editEmbed(
            bot.utils.embed(title, stripIndents`
            **Available categories:**
            ${categories.map(c => `- __${c}__`).join('\n')}
            
            **Usage:**
            Do \`${bot.config.prefix}help category <name>\` for a list of commands in a specific category.
            Do \`${bot.config.prefix}help all\` for a list of every command available in this bot.
            Do \`${bot.config.prefix}help <command>\` for help with a specific command.`)
        ).then(m => m.delete(10000));
    }
};

const getHelp = (bot, command) => ({
    name: `${command.info.name}`,
    value: stripIndents`
        **Usage:** \`${bot.config.prefix}${command.info.usage || command.info.name}\`
        **Description:** ${command.info.description || '<no description>'}
        **Category:** ${command.info.category}`
});

exports.info = {
    name: 'help',
    usage: 'help all|[command]|[category <name>]',
    description: 'Shows you help for all commands or just a single command'
};
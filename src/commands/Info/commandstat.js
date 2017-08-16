exports.run = async function (bot, msg, args) {
    let command = bot.commands.findBy('name', args[0]);
    if (!command) {
        throw 'That command doesn\'t exist!';
    }

    let amount = bot.managers.stats.get(command.info.name) || 0;
    return (await msg.edit({
        embed: bot.utils.embed(command.info.name, `You've used **${command.info.name}** a total of ${amount} times.`)
    })).delete(6000);
};

exports.info = {
    name: 'commandstat',
    usage: 'commandstat <command>',
    description: 'Show usage count for a specific command.'
};

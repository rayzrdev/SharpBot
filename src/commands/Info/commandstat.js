exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please specify a command';
    }
    
    let command = bot.commands.get(args[0]);
    if (!command) {
        throw 'That command doesn\'t exist!';
    }

    let amount = bot.managers.stats.get(`command.${command.info.name}`) || 0;
    return (await msg.edit({
        embed: bot.utils.embed(command.info.name, `You've used **${command.info.name}** a total of ${amount} times.`)
    })).delete(6000);
};

exports.info = {
    name: 'commandstat',
    usage: 'commandstat <command>',
    description: 'Show usage count for a specific command.',
    credits: '<@149916494183137280>' // Liam Bagge#0550
};

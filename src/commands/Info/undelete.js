exports.run = function (bot, msg, args) {
    let id = msg.channel.type === 'text' && msg.mentions.users.size ? msg.mentions.users.first().id : args[0];
    if (msg.channel.type === 'text' && args[0].replace(/!/g, '') !== msg.mentions.users.first().toString()) id = args[0];
    const delmsg = bot.deleted.get(id);
    if(!delmsg) throw 'No recently deleted messages found';
    bot.deleted.delete(id);
    const text = `Undeleted message of ${msg.mentions.users.first().name} in ${delmsg.guild.name} | ${delmsg.channel.name}\n\`\`\`${delmsg.content}\`\`\``;
    msg.edit(text);
};

exports.info = {
    name: 'undelete',
    usage: 'undelete <mention of user>',
    description: 'Undeletes messages'
};

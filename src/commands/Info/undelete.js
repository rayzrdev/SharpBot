exports.run = function (bot, msg) {
    const user = msg.mentions.users.first();
    if (!user) {
        throw 'Please mention a user.';
    }

    const delmsg = bot.deleted.get(user.id);
    if (!delmsg) {
        throw 'No recently deleted messages found';
    }

    bot.deleted.delete(user.id);

    msg.edit(`Undeleted message of ${user.username} in ${delmsg.guild.name} | ${delmsg.channel.name}\n\`\`\`${delmsg.content}\`\`\``);
};

exports.info = {
    name: 'undelete',
    usage: 'undelete <mention of user>',
    description: 'Undeletes messages'
};

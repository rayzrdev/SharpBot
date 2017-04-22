exports.run = function (bot, msg) {
    let users = msg.guild.members.map(m => `${m.user} ${(m.user.bot ? '**`[BOT]`**' : '')}`).sort();

    let messages = [];
    while (users.length > 50) {
        messages.push(users.splice(0, 50));
    }
    messages.push(users);

    msg.edit(':arrows_counterclockwise:');
    Promise.all(
        messages.map(group => msg.channel.sendEmbed(
            bot.utils.embed('', group.join('\n'), [], { footer: false })
        ))
    ).then(subMsgs => {
        msg.delete();
        subMsgs.forEach(m => m.delete(30000));
    }).catch(msg.error);

};

exports.info = {
    name: 'users',
    usage: 'users',
    description: 'Lists all users on your current server'
};

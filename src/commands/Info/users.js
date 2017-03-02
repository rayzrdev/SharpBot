exports.run = function (bot, msg) {
    var users = msg.guild.members.map(m => `${m.user} ${(m.user.bot ? '**`[BOT]`**' : '')}`).sort();

    var messages = [];
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
    }).catch(err => {
        console.error(err);
        msg.edit(':no_entry_sign: An error has occurred!').then(m => m.delete(2000));
    });

};

exports.info = {
    name: 'users',
    usage: 'users',
    description: 'Lists all users on your current server'
};
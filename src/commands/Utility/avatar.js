exports.run = (bot, msg) => {
    const user = msg.mentions.users.first();
    if (!user) {
        throw 'Please mention the user who you want the avatar from.';
    }

    if (!user.avatarURL) {
        throw 'That user does not have an avatar.';
    }

    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed(`${user.username}'s Avatar`, `[Download](${user.avatarURL})`, [], { image: user.avatarURL })
    }).then(m => m.delete(30000));
};

exports.info = {
    name: 'avatar',
    usage: 'avatar <user>',
    description: 'Gives you the avatar of a user'
};

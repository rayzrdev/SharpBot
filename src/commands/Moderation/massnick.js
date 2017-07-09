exports.run = function (bot, msg, args) {
    let nick = args[0];

    if (!msg.guild.me.permissions.has('MANAGE_NICKNAMES')) {
        throw 'You don\'t have permission to change users nickname on this server.';
    }
    if (args.length < 1) {
        throw 'You must specify a nickname.';
    }
    if (nick.length > 32) {
        throw 'Nickname must be shorter than 32 characters.';
    }
    msg.delete();
    
    msg.guild.fetchMembers()
        .then(guild => {
            guild.members.map(m => {
                m.setNickname(nick).then().catch();
            });
            msg.channel.send(`:white_check_mark: Changing everyones nickname to ${nick}.`).then(m => m.delete(4000));
        }).catch(msg.error);
};

exports.info = {
    name: 'massnick',
    usage: 'massnick <nick>',
    description: 'Changes everyones nickname in a server',
    credits: '<@149916494183137280>'
};

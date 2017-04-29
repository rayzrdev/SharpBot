const dateFormat = require('dateformat');
const stripIndents = require('common-tags').stripIndents;

dateFormat('dddd, mmmm dS, yyyy, h:MM:ss TT');

exports.run = function (bot, msg) {

//Makes sure user mentions a user to get info for
    if (msg.mentions.users.size < 1) {
        throw '@mention someone to find the info';
    }
//Makes sure command is sent in a guild
    if (!msg.guild) {
        throw 'This can only be used in a guild!';
    }

    let member = msg.guild.member(msg.mentions.users.first());
    let user = msg.mentions.users.first();

//How long ago the account was created
    const millisCreated = new Date().getTime() - user.createdAt.getTime();
    const daysCreated = millisCreated/1000/60/60/24;

//How long about the user joined the server
    const millisJoined = new Date().getTime() - member.joinedAt.getTime();
    const daysJoined = millisJoined/1000/60/60/24;

// Slice off the first item (the @everyone)
    let roles = member.roles.array().slice(1).sort((a, b) => a.comparePositionTo(b)).reverse().map(role => role.name);
    if (roles.length < 1) roles = ['None'];
    
    let embed = bot.utils.embed(
        `${user.username}#${msg.mentions.users.first().discriminator}`,
        stripIndents`
        ***This message will dissappear in 30 seconds.***`,
        [
            {
                name: 'Status',
                value: `${user.presence.status[0].toUpperCase() + user.presence.status.slice(1)}`,
            },
            {
                name: 'Game',
                value: `${(user.presence.game && user.presence.game && user.presence.game.name) || 'Not playing a game.'}`,
            },
            {
                name: 'Created On',
                value: `${dateFormat(user.createdAt)}`,
            },
            {
                name: 'Days Since Creation',
                value: `${daysCreated.toFixed(0)}`,
            },
            {
                name: 'Joined On',
                value: `${dateFormat(member.joinedAt)}`,
            },
            {
                name: 'Days Since Joining',
                value: `${daysJoined.toFixed(0)}`,
            },
            {
                name: 'Roles',
                value: `${roles.join(', ')}`,
                inline: false,
            },
        ],
        {
            inline: true,
            footer: `User ID: ${user.id}`
        });

    embed.setThumbnail(`${user.displayAvatarURL}`);

    msg.editEmbed(embed).then(m => m.delete(30000));

};

exports.info = {
    name: 'userinfo',
    usage: 'userinfo <user>',
    description: 'Shows info about a user'
};


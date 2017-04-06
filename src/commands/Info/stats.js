const formatTime = (time) => {
    var seconds = time[0] + time[1] / 1e9;

    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    var hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours.toFixed(0)} hours, ${minutes.toFixed(0)} minutes and ${seconds.toFixed(0)} seconds`;
};

exports.run = (bot, msg) => {

    msg.editEmbed(
        bot.utils.embed('SharpBot Stats', '***This message will dissappear in 15 seconds.***', [
            {
                name: ':outbox_tray: Messages sent',
                value: bot.stats.get('messages-sent') || 0,
            },
            {
                name: ':inbox_tray: Messages received',
                value: bot.stats.get('messages-received') || 0,
            },
            {
                name: ':mailbox: Mentions',
                value: bot.stats.get('mentions') || 0
            },
            {
                name: ':baby: Users',
                value: `${bot.users.size.toLocaleString()}`,
            },
            {
                name: ':desktop: Servers',
                value: `${bot.guilds.size.toLocaleString()}`,
            },
            {
                name: ':keyboard: Channels',
                value: `${bot.channels.size.toLocaleString()}`,
            },
            {
                name: ':thinking: RAM usage',
                value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            },
            {
                name: ':stopwatch: Uptime',
                value: formatTime(process.hrtime(bot.stats.get('start-time')))
            },
            {
                name: ':video_game: Game',
                value: (bot.user.presence.game || {}).name || 'None'
            }
        ], { inline: true })
    ).catch(console.error).then(m => m.delete(15000));
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about SharpBot'
};
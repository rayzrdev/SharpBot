const formatTime = (time) => {
    let seconds = time[0] + time[1] / 1e9;

    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${hours.toFixed(0)}h ${minutes.toFixed(0)}m ${seconds.toFixed(0)}s`;
};

exports.run = (bot, msg) => {

    const game = bot.user.presence.game || {};

    msg.editEmbed(
        bot.utils.embed('SharpBot Stats', '***This message will dissappear in 15 seconds.***', [
            {
                name: ':outbox_tray: Messages sent',
                value: bot.managers.stats.get('messages-sent') || 0,
            },
            {
                name: ':inbox_tray: Messages received',
                value: bot.managers.stats.get('messages-received') || 0,
            },
            {
                name: ':mailbox: Mentions',
                value: bot.managers.stats.get('mentions') || 0
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
                value: formatTime(process.hrtime(bot.managers.stats.get('start-time')))
            },
            {
                name: ':video_game: Game',
                value: `${game.name || 'None'} ${game.streaming ? `[(Streaming)](${game.url})` : ''}`
            }
        ], { inline: true })
    ).catch(msg.error).then(m => m.delete(15000));
};

exports.info = {
    name: 'stats',
    usage: 'stats',
    description: 'Shows you stats about SharpBot'
};

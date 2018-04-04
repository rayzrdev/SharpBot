const normalizeUrl = require('normalize-url');

exports.run = async (bot, msg, args) => {
    let { leftover, options } = bot.utils.parseArgs(args, ['s:', 'w', 'l']);

    if (leftover.length < 1) {
        if (options.s) {
            throw 'You must provide a game as well as a stream URL.';
        }

        bot.user.setActivity(null, {});
        return msg.edit('Cleared your game! :ok_hand:').then(m => m.delete(3000));
    }

    let game = leftover.join(' ');
    let stream = options.s;

    let fields = [];

    let activityOptions = { type: 'PLAYING' };
    let activityFieldTitle = ':video_game: Game';

    if (stream) {
        stream = normalizeUrl(`twitch.tv/${stream}`);

        activityOptions.url = stream;
        activityOptions.type = 'STREAMING';

        fields.push({ name: ':headphones: Stream URL', value: stream });
    } else if (options.w) {
        activityOptions.type = 'WATCHING';
        activityFieldTitle = ':eyes: Watching';
    } else if (options.l) {
        activityOptions.type = 'LISTENING';
        activityFieldTitle = ':sound: Listening to';
    }

    fields.unshift({ name: activityFieldTitle, value: game });

    bot.user.setActivity(game, activityOptions);

    msg.delete();

    (await msg.channel.send({
        embed: bot.utils.embed(':ok_hand: Game changed!', '', fields)
    })).delete(5000);
};

exports.info = {
    name: 'setgame',
    usage: 'setgame <game>',
    description: 'Sets your game (shows for other people)',
    options: [
        {
            name: '-s',
            usage: '-s <url>',
            description: 'Sets your streaming URL to http://twitch.tv/<url>'
        },
        {
            name: '-w',
            description: 'Sets your game prefix to **Watching**'
        },
        {
            name: '-l',
            description: 'Sets your game prefix to **Listening to**'
        }
    ]
};

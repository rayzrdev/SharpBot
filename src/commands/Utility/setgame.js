const normalizeUrl = require('normalize-url');

exports.run = (bot, msg, args) => {
    msg.delete();
    if (args.length < 1) {
        bot.user.setGame(null, null);
        return msg.channel.sendMessage('Cleared your game! :ok_hand:').then(m => m.delete(3000));
    }

    let parsed = bot.utils.parseArgs(args, ['s:']);

    let game = parsed.leftover.join(' ');
    let stream = parsed.options.s;

    let fields = [{ name: ':video_game: Game', value: game }];

    if (stream) {
        stream = normalizeUrl(`twitch.tv/${stream}`);

        fields.push({ name: ':headphones: Stream URL', value: stream });
    }

    bot.user.setGame(game, stream);


    msg.channel.sendEmbed(
        bot.utils.embed(':ok_hand: Game changed!', '', fields)
    ).then(m => m.delete(5000));
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
        }
    ]
};

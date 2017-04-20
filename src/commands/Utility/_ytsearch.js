// ------------------------------------------------------------------------
// == This command is temporarily disabled until youtube-scrape is fixed ==
// ------------------------------------------------------------------------
const yts = require('youtube-scrape');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }

    msg.edit(':arrows_counterclockwise:').then(() => {

        yts(`${args.join(' ')}`).then(data => {
            if (data && data.results && data.results[0]) {
                let result = data.results[0];

                msg.editEmbed(
                    bot.utils.embed('', `[${result.title}](${result.link})`, [
                        {
                            name: ':eyes: Views',
                            value: bot.utils.formatNumber(result.views)
                        },
                        {
                            name: ':alarm_clock: Length',
                            value: result.length
                        }
                    ], { image: result.thumbnail })
                );
            } else {
                msg.error('No results found!');
            }
        });

    });
};

exports.info = {
    name: 'yt',
    usage: 'yt <query>',
    description: 'Fetches info about a YouTube video'
};

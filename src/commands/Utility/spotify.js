const got = require('got');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must specify a track url (spotify:track:XYZ)';
    }

    // possible inputs:
    // https://open.spotify.com/track/4SUBEjh0WcaPXNeBpuRC7a
    // spotify:track:4SUBEjh0WcaPXNeBpuRC7a
    // 4SUBEjh0WcaPXNeBpuRC7a

    let input = args.join(' ')
        .replace('https://open.spotify.com/track/','')
        .replace('spotify:track:','');
    let url = `https://api.spotify.com/v1/tracks/${input}`;
    msg.edit(':arrows_counterclockwise:  Loading track info for ' + input);

    got(url).then(res => {

        let data;

        try {
            data = JSON.parse(res.body);
        } catch (e) {
            msg.error('SpotifyAPI returned weird data. See console.');
            bot.logger.severe(e);
        }

        if (data['type'] === 'track') {
            
            let artists = [];
            data['artists'].forEach(function(artist) {
                artists.push(artist.name);
            }, this);

            let duration_m = Math.floor(data.duration_ms / 60000);
            let duration_s = ((data.duration_ms % 60000) / 1000).toFixed(0);

            let embed = bot.utils.embed(
                'Listen now!',
                `${msg.author.username} is currently listening to`,
                [
                    {
                        name: 'Artist(s)',
                        value: `${artists.join(', ')}`,
                    },
                    {
                        name: 'Title',
                        value: `${data.name}`,
                    },
                    {
                        name: 'Explict',
                        value: `${(data.explict)?'yes':'no'}`,
                    },
                    {
                        name: 'Popularity',
                        value: `${data.popularity} %`,
                    },
                    {
                        name: 'Duration',
                        value:  (duration_s == 60 ? (duration_m+1) + ':00' : duration_m + ':' + (duration_s < 10 ? '0' : '') + duration_s) + 'min',
                    },
                    {
                        name: 'Markets',
                        value:  `Song is available on ${data.available_markets.length} markets`,
                    },
                ],
                {
                    inline: true,
                    footer: 'Spotify Track Info',
                    color: [30, 215, 96]
                });
            
            embed.setThumbnail(`${data['album']['images'][2]['url']}`);
            embed.setURL(`${data['external_urls']['spotify']}`);
            msg.delete();
            msg.channel.sendEmbed(embed);

        } else {
            msg.error(`No info found for ${input}`);
        }

    }).catch(err => {
        msg.error('SpotifyAPI returned an error. See console.');
        bot.logger.severe(err);
    });
};

exports.info = {
    name: 'spotify',
    usage: 'spotify <trackurl>',
    description: 'shows detailed information about a spotify track',
    credits: '<@140541588915879936>' // Doxylamin#4539
};

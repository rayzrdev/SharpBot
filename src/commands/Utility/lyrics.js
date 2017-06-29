var musix = require('musicmatch')();
exports.run = (bot, msg, args) => {

    if (args.length < 1) {
        throw "Song name required!"
    }

    musix.trackSearch({
            q: args.join(' '),
            page: 1,
            page_size: 1
        })
        .then(function(data) {
            var result = JSON.stringify(data.message.body.track_list[0].track.track_id);
            musix.trackLyrics({
                    track_id: result
                })
                .then(function(data) {
                    var lyrics = data.message.body.lyrics.lyrics_body;
                    let embed = bot.utils.embed(
                        `Lyrics for ${args.join(' ')}`,
                        `${lyrics}`, 
                        {
                            color: [12, 240, 42]
                        });
                    msg.delete();
                    msg.channel.send(embed);
                }).catch(function(err) {
                    throw err;
                    msg.error("Lyrics was not found");
                })
        }).catch(function(err) {
            throw err
            msg.error("Song was not found")
        })

};
exports.info = {
    name: 'lyrics',
    usage: 'lyrics <song name>',
    description: 'Gives you the lyrics of your demanded song'
};

const RichEmbed = require('discord.js').RichEmbed;
const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyUriParser = require('spotify-uri');
const isgd = require('isgd');
const spotifyApi = new SpotifyWebApi({
    clientId : 'c3212bc49fb348ddb270f2bd0cfe6e0f',
    clientSecret : '0fa120b921e5434ab7f3d6338e70c125'
});

exports.init = function() {
    spotifyApi.clientCredentialsGrant()
    .then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
    }, function(err) {
        console.error('[spotify.js] Something went wrong when retrieving an access token. ', err);
    });
};

exports.run = function (bot, msg, args) {
    msg.delete();
    if (args.length < 1) {
        throw 'You must specify a spotify uri at least!';
    }

    let parsed = bot.utils.parseArgs(args, ['player']);
    let spotifyUri = SpotifyUriParser.parse(parsed.leftover.join(' '));

    switch(spotifyUri.type) {
    case 'track':
        getTrackEmbed(msg, spotifyUri.id, parsed.options.player);
        break;
    case 'artist':
        break;
    case 'playlist':
        break;
    default:
        throw 'Sorry, I can\'t parse that type of URI yet.';
    }

};

function getTrackEmbed(msg, spotifyId, withPlayer) {
    spotifyApi.getTrack(spotifyId)
    .then(function(data) {
        let apiResponse = data.body;
        let artists = [];

        apiResponse.artists.forEach(function(element) {
            artists.push(element.name);
        }, this);

        const embed = new RichEmbed()
        .setColor([30,215,96])
        .setThumbnail(apiResponse.album.images[0].url)
        .setAuthor('Click to listen on Spotify','https://image.flaticon.com/icons/png/512/174/174872.png', apiResponse.external_urls.spotify)
        .addField('Artist', artists.join(', '), true)
        .addField('Title',  apiResponse.name, true)
        .addField('Length', calculateDuration(apiResponse.duration_ms), true)
        .addField('Album',  apiResponse.album.name, true)
        .addField('Parental Advisory',  ((apiResponse.explicit)?'contains explicit lyrics':'none applicable'), true)
        .addField('Availability', `Available in ${apiResponse.available_markets.length} countrys`, true)
        .addField('Popularity', `${apiResponse.popularity}%`, true);
        
        msg.channel.send({embed:embed});

        if(withPlayer) msg.channel.send(`Got spotify? Click below to play! ${apiResponse.external_urls.spotify}`);

    }, function(err) {
        throw `Something went wrong! ${err}`;
    });
}

function calculateDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes+1) + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
}

exports.info = {
    name: 'spotify',
    usage: 'spotify <url>',
    description: 'Parses a spotify-uri and outputs its information.',
    examples: [
        'spotify spotify:track:5DkCAVqn09WAPOPiphKOUD',
        'spotify -player spotify:track:5DkCAVqn09WAPOPiphKOUD',
        'spotify https://open.spotify.com/track/5DkCAVqn09WAPOPiphKOUD'
    ],
    options: [
        {
            name: '-player',
            description: 'Sends another message where discord places it\'s own embedded player'
        }
    ]
};

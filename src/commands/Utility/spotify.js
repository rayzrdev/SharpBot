const RichEmbed = require('discord.js').RichEmbed;
const SpotifyWebApi = require('spotify-web-api-node');
const SpotifyUriParser = require('spotify-uri');
const got = require('got');
const spotifyApi = new SpotifyWebApi();

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must specify a Spotify URI at least!';
    }

    const response = await got('https://spotify-auth.doxylamin.pw/', { json: true });

    if (response.body.success == true) {
        spotifyApi.setAccessToken(response.body.access_token);
    }

    const parsed = bot.utils.parseArgs(args, ['preview']);
    const spotifyUri = SpotifyUriParser.parse(parsed.leftover.join(' '));

    switch (spotifyUri.type) {
    case 'track':
        getTrackEmbed(msg, spotifyUri.id, parsed.options.preview);
        break;
    case 'artist':
        getArtistEmbed(msg, spotifyUri.id, parsed.options.preview);
        break;
    case 'playlist':
        getPlaylistEmbed(msg, spotifyUri.user, spotifyUri.id, parsed.options.preview);
        break;
    default:
        throw 'Sorry, I can\'t parse that type of URI yet.';
    }

};

function getPlaylistEmbed(msg, user, spotifyId, withPreview) {
    spotifyApi.getPlaylist(user, spotifyId)
        .then(data => {
            const apiResponse = data.body;

            const embed = new RichEmbed()
                .setColor([30, 215, 96])
                .setThumbnail(apiResponse.images[0].url)
                .setAuthor('Click to listen on Spotify', 'https://image.flaticon.com/icons/png/512/174/174872.png', apiResponse.external_urls.spotify)
                .addField('Playlist Name', apiResponse.name, true)
                .addField('Created by', apiResponse.owner.display_name, true)
                .addField('Description', apiResponse.description, true)
                .addField('Public Playlist', ((apiResponse.public) ? 'Yes' : 'No'), true)
                .addField('Collaborative', ((apiResponse.collaborative) ? 'Yes' : 'No'), true)
                .addField('Followers', apiResponse.followers.total, true)
                .addField('Track Count', apiResponse.tracks.total, true);

            msg.edit({ embed });

            if (withPreview) msg.channel.send(`Got spotify? Click below to play! ${apiResponse.external_urls.spotify}`);

        }).catch(err => {
            throw `Something went wrong! ${err}`;
        });
}

function getArtistEmbed(msg, spotifyId, withPreview) {
    spotifyApi.getArtist(spotifyId)
        .then(data => {
            const apiResponse = data.body;

            const embed = new RichEmbed()
                .setColor([30, 215, 96])
                .setThumbnail(apiResponse.images[0].url)
                .setAuthor('Click to listen on Spotify', 'https://image.flaticon.com/icons/png/512/174/174872.png', apiResponse.external_urls.spotify)
                .addField('Artist Name', apiResponse.name, true)
                .addField('Followers', apiResponse.followers.total.toLocaleString(), true)
                .addField('Popularity', apiResponse.popularity + '%', true)
                .addField('Genres', ((apiResponse.genres.length > 0) ? apiResponse.genres.join(', ') : 'unknown'), true);

            msg.edit({ embed });

            if (withPreview) msg.channel.send(`Got spotify? Click below to play! ${apiResponse.external_urls.spotify}`);

        }).catch(err => {
            throw `Something went wrong! ${err}`;
        });
}

function getTrackEmbed(msg, spotifyId, withPreview) {
    spotifyApi.getTrack(spotifyId)
        .then(data => {
            const apiResponse = data.body;
            let artists = apiResponse.artists.map(artist => artist.name);

            const embed = new RichEmbed()
                .setColor([30, 215, 96])
                .setThumbnail(apiResponse.album.images[0].url)
                .setAuthor('Click to listen on Spotify', 'https://image.flaticon.com/icons/png/512/174/174872.png', apiResponse.external_urls.spotify)
                .addField('Artist', artists.join(', '), true)
                .addField('Title', apiResponse.name, true)
                .addField('Length', calculateDuration(apiResponse.duration_ms), true)
                .addField('Album', apiResponse.album.name, true)
                .addField('Parental Advisory', ((apiResponse.explicit) ? 'contains explicit lyrics' : 'none applicable'), true)
                .addField('Availability', `Available in ${apiResponse.available_markets.length} countrys`, true)
                .addField('Popularity', `${apiResponse.popularity}%`, true);

            msg.edit({ embed });

            if (withPreview) msg.channel.send(`Got spotify? Click below to play! ${apiResponse.external_urls.spotify}`);

        }).catch(err => {
            throw `Something went wrong! ${err}`;
        });
}

function calculateDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return (seconds == 60 ? (minutes + 1) + ':00' : minutes + ':' + (seconds < 10 ? '0' : '') + seconds);
}

exports.info = {
    name: 'spotify',
    usage: 'spotify <url>',
    description: 'Parses a spotify-uri and outputs its information.',
    examples: [
        'spotify spotify:track:5DkCAVqn09WAPOPiphKOUD',
        'spotify -preview spotify:track:5DkCAVqn09WAPOPiphKOUD',
        'spotify https://open.spotify.com/track/5DkCAVqn09WAPOPiphKOUD'
    ],
    options: [
        {
            name: '-preview',
            description: 'Sends another message where discord places it\'s own embedded player'
        }
    ],
    credits: '<@140541588915879936>' // Doxylamin#3377
};

const got = require('got');

// Public API key provided by Giphy for anyone to use.
const API_KEY = 'dc6zaTOxFJmzC';

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }

    const res = await got(`http://api.giphy.com/v1/gifs/random?api_key=${API_KEY}&tag=${encodeURIComponent(args.join(' '))}`, { json: true });

    if (!res || !res.body || !res.body.data) {
        throw 'Failed to find a GIF that matched your query!';
    }

    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed('', '', [], { image: res.body.data.image_url })
    });
};

// async function findRandom(query) {}

exports.info = {
    name: 'gif',
    usage: 'gif <query>',
    description: 'Searches Giphy for GIFs'
};

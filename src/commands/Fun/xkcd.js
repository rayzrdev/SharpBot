const got = require('got');

exports.run = async (bot, msg, args) => {
    let id;

    if (args[0] === 'latest') {
        id = (await getLatest()).num;
    } else {
        id = parseInt(args[0]);
        if (isNaN(id)) {
            id = await getRandom();
        }
    }

    // Avoid the 404 page
    while (id === 404) {
        id = await getRandom();
    }

    const info = await getInfo(id);

    msg.delete();
    msg.channel.send({
        embed: bot.utils.embed(`[${id}] ${info.title}`, '', [], {
            image: info.img,
            // Color of the XKCD website.
            color: [150, 168, 199],
            url: `http://xkcd.com/${id}`
        }).setFooter(info.alt)
    });
};

async function getInfo(id) {
    return (await got(`http://xkcd.com/${id}/info.0.json`, { json: true })).body;
}

async function getLatest() {
    return (await got('http://xkcd.com/info.0.json', { json: true })).body;
}

async function getRandom() {
    const latest = await getLatest();
    const max = latest.num;

    return Math.floor(Math.random() * max);
}

exports.info = {
    name: 'xkcd',
    usage: 'xkcd [latest|<id>]',
    description: 'Fetches random or specific XKCD comics'
};

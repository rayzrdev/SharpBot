const got = require('got');
const cheerio = require('cheerio');

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide the username of a player.';
    }

    const username = args[0];

    const uuid = await getUUID(username);
    if (!uuid) {
        throw 'That player could not be found.';
    }

    msg.delete();
    return msg.channel.send({
        embed: bot.utils.embed('', '', [
            {
                name: 'Username',
                value: username
            },
            {
                name: 'UUID',
                value: `\`${uuid}\``
            },
            {
                name: 'Skin',
                value: `[Download](https://crafatar.com/skins/${uuid}.png)`
            }
        ], { thumbnail: `https://crafatar.com/avatars/${uuid}.png?size=250&overlay=true` })
    });
};

async function getUUID(username) {
    const res = await got(`https://mcuuid.net/?q=${username}`);
    const $ = cheerio.load(res.body);
    const input = $('input')[1];

    if (!input) {
        return;
    }

    return input.attribs['value'];
}

exports.info = {
    name: 'playerinfo',
    usage: 'playerinfo <username>',
    description: 'Shows information about a Minecraft player'
};

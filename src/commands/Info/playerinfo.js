const got = require('got');
const cheerio = require('cheerio');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide a username';
    }

    const username = args[0];

    getUUID(username).then(uuid => {
        if (!uuid) {
            return msg.error('That player could not be found.');
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
    }).catch(msg.error);
};

function getUUID(username) {
    return got(`https://mcuuid.net/?q=${username}`).then(res => {
        const $ = cheerio.load(res.body);
        const input = $('input')[1];

        if (!input) {
            return;
        }

        return input.attribs['value'];
    });
}

exports.info = {
    name: 'playerinfo',
    usage: 'playerinfo <username>',
    description: 'Shows information about a Minecraft player'
};

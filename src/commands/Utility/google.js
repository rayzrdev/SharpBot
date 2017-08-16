const cheerio = require('cheerio');
const snekfetch = require('snekfetch');
const { stringify } = require('querystring');
const { RichEmbed } = require('discord.js');

exports.run = async (bot, msg, args) => {
    if(args.length < 1) throw 'I need to know what to search...';

    await msg.edit(':arrows_counterclockwise: Googling....')

    const params = {
        q: args.join(' '),
        safe: 'on',
        lr: 'lang_en',
        hl: 'en'
    };

    let resp = await snekfetch.get('https://google.com/search?' + stringify(params)).set('User-Agent', 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) Gecko/20100101 Firefox/53.0');

    if(resp.status !== 200) throw 'Google didn\'t want to respond somehow';

    let $ = cheerio.load(resp.body);

    let results = [];

    let card = null;

    let cardNode = $('div#rso > div._NId').find('div.vk_c, div.g.mnr-c.g-blk, div.kp-blk');

    if(!cardNode || cardNode.length === 0) card = null;
    else card = bot.utils.parseCards($, cardNode);

    $('.rc > h3 > a').each((i, e) => {
        const link = $(e).attr('href');
        const text = $(e).text();
        if(link) {
            results.push({ text : text, link: link });
        }
    });

    if(card) {
        const value = results.slice(0, 3).map(r => `[${r.text}](${r.link})`).join('\n');
        if(value) {
            card.addField(`This is what I also found for: "${params.q}" `, value)
                .setColor(bot.utils.randomColor())
                .setURL(`https://google.com/search?q=${encodeURIComponent(params.q)}`);
        }
        return await msg.edit({ embed: card });
    }

    if(results.length === 0) {
        return await msg.channel.send('Sorry, we didn\'t found any results');
    }

    let nexttwo = results.slice(1, 3).map(r => `[${r.text}](${r.link})`).join('\n');
    let firstentry = `[${results[0].text}](${results[0].link})`;


    const embed = bot.utils.embed(`Search results for ${args.join(' ')}`, firstentry, [
        {
            name: 'More links',
            value: nexttwo
        }
    ]).setURL(`https://google.com/search?q=${encodeURIComponent(params.q)}`);
    await msg.edit('', {embed: embed});

};

exports.info = {
    name: 'google',
    usage: 'google <query>',
    description: 'Searches google using magic :O'
};

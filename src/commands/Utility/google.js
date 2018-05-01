const cheerio = require('cheerio');
const got = require('got');
const { stringify } = require('querystring');
const { RichEmbed } = require('discord.js');

exports.run = async (bot, msg, args) => {
    if(args.length < 1) throw 'I need to know what to search...';

    await msg.edit(':arrows_counterclockwise: Googling....');

    const params = {
        q: args.join(' '),
        safe: 'on',
        lr: 'lang_en',
        hl: 'en'
    };

    let resp = await got('https://google.com/search?' + stringify(params), { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) Gecko/20100101 Firefox/53.0' }});

    if(resp.statusCode !== 200) throw 'Google didn\'t want to respond somehow';

    const $ = cheerio.load(resp.body);

    const results = [];

    let card = null;

    const cardNode = $('div#rso > div._NId').find('div.vk_c, div.g.mnr-c.g-blk, div.kp-blk');

    if(cardNode && cardNode.length !== 0) {
        card = this.parseCards($, cardNode);
    }

    $('.rc > h3 > a').each((i, e) => {
        const link = $(e).attr('href');
        const text = $(e).text();
        if(link) {
            results.push({ text, link });
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
    
    const firstentry = `[${results[0].text}](${results[0].link})`;
    const nexttwo = results.slice(1, 3).map(r => `[${r.text}](${r.link})`).join('\n');


    const embed = bot.utils.embed(`Search results for ${args.join(' ')}`, firstentry, [
        {
            name: 'More links',
            value: nexttwo
        }
    ], { url: `https://google.com/search?q=${encodeURIComponent(params.q)}`});
    await msg.edit('', {embed: embed});

};

exports.parseCards = ($, node) => {
    const e = new RichEmbed();


    //calculator card
    if(node.find('span.cwclet').first().length > 0) {
        e.setTitle(':nerd: Calculator');
        const calculation = node.find('span.cwclet').first().text();
        let result = node.find('.cwcot').first().text();
        if(result)
            result = `${calculation.trim()} ${result.trim()}`;
        else result = `${calculation} ...`;
        e.setDescription(result);
        return e;
    }

    //unit conversion card
    if(node.find('input[class*=_eif]').length > 0 && node.find('input[class*=_eif]').first().attr('value').length > 0) {
        if(node.find('input[class*=_eif]').length === 2) {
            e.setTitle(':scales: Unit conversion');

            try {
                const firstvalue = node.find('input[class*=_eif]').eq(0).attr('value');
                const firstunit = node.find('input[class*=_eif]').eq(0).parent().find('select :selected').text().toLowerCase();
                const secondvalue = node.find('input[class*=_eif]').eq(1).attr('value');
                const secondunit = node.find('input[class*=_eif]').eq(1).parent().find('select :selected').text().toLowerCase();
                e.setDescription(`${firstvalue} ${firstunit} = ${secondvalue} ${secondunit}`);
            } catch(e) {
                return;
            }

            return e;
        }

    }

    //currency converter card
    if(node.find('.ct-cs').first().length > 0) {
        e.setTitle(':moneybag: Currency converter');

        try {
            let firsttext = node.find('.vk_sh.vk_gy.cursrc').text();
            let secondtext = node.find('.vk_ans.vk_bk.curtgt > span').first().text() + node.find('.vk_ans.vk_bk.curtgt > span').eq(1).text();

            let result = `${firsttext} ${secondtext}`;
            e.setDescription(result);
        } catch(e) {
            return;
        }

        return e;
    }

    //generic info card
    if(node.find('._oDd > ._Tgc').first().length > 0) {
        e.setDescription(node.find('._oDd > ._Tgc').first().text());

        return e;
    }

    //translation card
    if(node.find('div#tw-ob').first().length > 0) {
        const srctext = node.find('pre#tw-source-text > span').first().text();
        let srclang = node.find('select#tw-sl > option:selected').first().text();

        const desttext = node.find('pre#tw-target-text > span').first().text();
        const destlang = node.find('select#tw-tl > option:selected').first().text();

        if(srclang.includes('detected')) {
            srclang = srclang.replace(' - detected', '');
        }

        e.setTitle(':man_with_turban: Translation card');
        try {
            e.addField(srclang, srctext, true);
            e.addField(destlang, desttext, true);
        } catch(e) {
            return;
        }

        return e;
    }

    //time in card
    if(node.find('div.vk_bk.vk_ans').first().length > 0) {
        let time = node.find('div.vk_bk.vk_ans').text();
        try {
            e.setTitle(`:alarm_clock: ${node.find('span').text()}`)
                .setDescription(`${time}`);
        } catch(e) {
            return;
        }
        return e;
    }

    //defenition cards
    const words = node.find('span[data-dobid=hdw]');
    if(words.length > 0) {
        node.find('span[data-dobid=hdw]').each((i, word) => {
            const root = node.find('span[data-dobid=hdw]').parent().parent();

            const pronunciation = $(root).find('span.lr_dct_ph > span');
            if(!pronunciation) return true;

            const select = (selector) => $(selector).parent().parent().parent().find('ol.lr_dct_sf_sens')
                .find('div.lr_dct_sf_sen.vk_txt')
                .find('div._Jig > div[data-dobid=dfn] > span');

            const lexicalCategory = $(root).find('div.lr_dct_sf_h > i > span');
            let defenitions = select(root);

            $(lexicalCategory).each((i, category) => {
                defenitions = select(category);
                try {
                    let descrip = [`${$(category).text()}`];
                    $(defenitions).each((i, e) => {
                        descrip.push(`${i + 1}. ${$(e).text()}`);
                    });

                    if(i === 0) e.addField(`${$(word).text()} / ${$(pronunciation).text()}`, descrip.join('\n'));
                    else e.addField(`${$(word).text()} / ${$(pronunciation).text()}`, descrip.join('\n'));
                } catch(e) {
                    return true;
                }
            });
        });

        return e;
    }

};


exports.info = {
    name: 'google',
    usage: 'google <search>',
    description: 'Searches Google using magic'
};

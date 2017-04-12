var cheerio = require('cheerio');
var request = require('request')

const URL = 'http://thecodinglove.com/random';
exports.run = (bot, msg, args) => {


    msg.edit(':arrows_counterclockwise:').then(() => {

        request(URL, (err, res, html) => {
            if (err) {
                console.log('[ERROR]\n', err);
                return;
            }
            const $ = cheerio.load(html);

            // Scrape the 'title' and 'gifs' of the funny shit!
            $('.bodytype').each(function(i, el) {
                const title = $(this).prev().text();
                const gif = $(this).children().children().first().attr('src');


                msg.channel.sendEmbed(bot.utils.embed(`${title}`, '', [], {
                        image: gif
                    }))
                    .then(() => msg.delete()).catch(msg.error);
            });
        })
    });
};

exports.info = {
    name: 'devfact',
    usage: 'devfact',
    description: 'Gets you a fact about developers'
};

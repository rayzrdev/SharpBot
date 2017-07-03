const xkcd = require('xkcd-imgs');

exports.run = function (bot, msg) {
    msg.edit(':arrows_counterclockwise:').then(() => {
        xkcd.img((err, res) => {
            if (err) {
                return msg.error(err);
            }

            msg.edit({
                embed: bot.utils.embed('', '', [], { image: res.url, footer: res.title })
            });
        });
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
};

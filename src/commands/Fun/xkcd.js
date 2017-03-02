const xkcd = require('xkcd-imgs');

exports.run = function (bot, msg) {
    msg.edit(':arrows_counterclockwise:').then(m => {
        xkcd.img((err, res) => {
            if (err) {
                console.error(err);
                return m.error();
            }
            m.edit('', {
                embed: bot.utils.embed('', res.title, [], { url: res.url })
            });
        });
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
};
const xkcd = require('xkcd-imgs');

exports.run = function (bot, msg) {
    msg.edit(':arrows_counterclockwise:').then(() => {
        xkcd.img((err, res) => {
            if (err) {
                return msg.error(err);
            }
            msg.editEmbed(
                bot.utils.embed('', res.title, [], { url: res.url })
            );
        });
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
};

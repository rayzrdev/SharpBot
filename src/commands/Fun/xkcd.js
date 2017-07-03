const xkcd = require('xkcd-imgs');

exports.run = function (bot, msg) {
    xkcd.img((err, res) => {
        if (err) {
            return msg.error(err);
        }

        msg.delete();
        msg.channel.send({
            embed: bot.utils.embed('', '', [], {
                image: res.url,
                // Color of the XKCD website background. Seems right.
                color: [150, 168, 199]
            }).setFooter(res.title)
        });
    });
};

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
};

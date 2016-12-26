const xkcd = require('xkcd-imgs');
const utils = require('../utils');

exports.run = function (bot, msg) {
    msg.channel.sendMessage(':arrows_counterclockwise: Loading comic...').then(m => {
        xkcd.img((err, res) => {
            if (err) {
                m.edit(':no_entry_sign: An error has occurred!');
                console.log(JSON.stringify(err));
                return;
            }
            m.edit('', {
                embed: utils.embed('', res.title, [], { url: res.url })
            })
        })
    });
}

exports.info = {
    name: 'xkcd',
    usage: 'xkcd',
    description: 'Shows you random xkcd comics'
}
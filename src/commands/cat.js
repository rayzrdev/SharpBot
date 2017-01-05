const request = require('superagent');

function getCat(callback) {
    request.get('http://www.random.cat/meow', (err, res) => {
        callback(res.body.file);
    });
}

exports.getCat = getCat;

exports.run = function (bot, msg) {
    msg.delete();
    msg.channel.sendMessage(':cat: Have some cat pix:');
    getCat((url) => msg.channel.sendMessage(url));
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows you pictures of random cats'
};
const got = require('got');

exports.getCat = function (callback) {
    got('http://www.random.cat/meow').then(res => callback(JSON.parse(res.body).file));
};

exports.run = function (bot, msg) {
    msg.delete();
    msg.channel.sendMessage(':cat: Have some cat pix:');
    this.getCat((url) => msg.channel.sendMessage(url));
};

exports.info = {
    name: 'cat',
    usage: 'cat',
    description: 'Shows you pictures of random cats'
};
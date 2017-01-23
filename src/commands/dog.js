const got = require('got');

exports.getDog = function (callback) {
    got('http://random.dog/woof').then(res => callback(`http://random.dog/${res.body}`));
};

exports.run = function (bot, msg) {
    msg.delete();
    msg.channel.sendMessage(':dog: Have some dog pix:');
    this.getDog((url) => msg.channel.sendMessage(url));
};

exports.info = {
    name: 'dog',
    usage: 'dog',
    description: 'Shows you pictures of random dogs'
};
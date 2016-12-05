const request = require('superagent');

exports.run = function (bot, msg) {
    msg.delete();
    msg.channel.sendMessage(':dog: Have some dog pix:');
    request.get('http://random.dog/woof', (err, res) => {
        msg.channel.sendMessage(`http://random.dog/${res.text}`);
    });
};

exports.info = {
    name: 'dog',
    usage: 'dog',
    description: 'Shows you pictures of random dogs'
};
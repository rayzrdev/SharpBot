const got = require('got');

exports.getDog = function (callback) {
    got('http://random.dog/woof').then(res => callback(undefined, `http://random.dog/${res.body}`)).catch(callback);
};

exports.run = function (bot, msg) {
    msg.edit(':arrows_counterclockwise:');
    this.getDog((err, res) => {
        if (err) {
            console.error(err);
            return msg.error();
        }

        msg.channel.sendFile(res).then(() => msg.delete()).catch(err2 => {
            console.error(err2);
            msg.error('Failed to send the file!');
        });
    });
};

exports.info = {
    name: 'dog',
    usage: 'dog',
    description: 'Shows you pictures of random dogs'
};
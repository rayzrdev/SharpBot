const got = require('got');

exports.getDog = function (callback) {
    got('http://random.dog/woof').then(res => callback(undefined, `http://random.dog/${res.body}`)).catch(callback);
};

exports.run = function (bot, msg) {
    msg.edit(':arrows_counterclockwise:');
    this.getDog((err, res) => {
        if (err) {
            return msg.error(err);
        }

        msg.channel.sendFile(res).then(() => msg.delete()).catch(err2 => {
            bot.logger.severe(err2);
            msg.error('Failed to send the file!');
        });
    });
};

exports.info = {
    name: 'dog',
    usage: 'dog',
    description: 'Shows you pictures of random dogs'
};

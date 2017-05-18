const got = require('got');

exports.run = (bot, msg) => {
    msg.edit(':arrows_counterclockwise:').then(() => {
        got('http://belikebill.azurewebsites.net/billgen-API.php?default=1', { encoding: null }).then(res => {
            msg.channel.send({
                file: {
                    attachment: res.body,
                    name: 'bill.jpg'
                }
            }).then(() => msg.delete());
        }).catch(msg.error);
    });
};

exports.info = {
    name: 'bill',
    usage: 'bill',
    description: 'Be like Bill!'
};

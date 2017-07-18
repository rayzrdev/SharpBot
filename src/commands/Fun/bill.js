const got = require('got');

exports.run = async (bot, msg) => {
    await msg.edit(':arrows_counterclockwise:');
    const { body } = await got('http://belikebill.azurewebsites.net/billgen-API.php?default=1', { encoding: null });

    await msg.channel.send({
        file: {
            attachment: body,
            name: 'bill.jpg'
        }
    });

    msg.delete();
};

exports.info = {
    name: 'bill',
    usage: 'bill',
    description: 'Be like Bill!'
};

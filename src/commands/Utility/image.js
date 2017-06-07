const IMAGE_NAME = /\.(jpe?g|png|gif|webp)$/i;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide an image URL to send.';
    }

    const url = args[0];
    let name;

    if (!IMAGE_NAME.test(url)) {
        name = 'image.png';
    }

    msg.channel.send({
        file: {
            name,
            attachment: url
        }
    }).then(() => {
        msg.delete();
    }).catch(() => {
        msg.error('Failed to send image.');
    });
};

exports.info = {
    name: 'image',
    usage: 'image <url>',
    description: 'Sends an image from a URL'
};

const {
    stripIndents
} = require('common-tags');

exports.run = (bot, msg, args) => {
    let count = parseInt(args[0]) || 100;
    let attachments = [];

    msg.edit(':arrows_counterclockwise: Fetching...');
    msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id }).then(messages => {
        msg.delete();

        messages.map(m => {
            m.attachments.map(attachment => {
                if (attachment.height) {
                    attachments.push(attachment.url);
                }
            });
        });

        if (attachments.length === 0) throw 'Couldn\'t find any images.';
        msg.channel.send(stripIndents`
                :white_check_mark: ${attachments.length} images scraped:
                ${attachments.join('\n')}`);
    }).catch(msg.error);
};

exports.info = {
    name: 'imagescraper',
    usage: 'imagescraper <amount>',
    description: 'Grabs all images from the specified amount of messages (max 100)',
    credits: '<@149916494183137280>' // Liam Bagge#0550
};

const got = require('got');
const fs = require('fs');
const path = require('path');
exports.run = (bot, msg, args) => {
    let count = parseInt(args[0]) || 100;
    let attachments = [];

    msg.channel.fetchMessages({ limit: Math.min(count, 100), before: msg.id }).then(messages => {
        messages.map(m => {
            m.attachments.map(attachment => {
                if (attachment.height) {
                    attachments.push(attachment.url);
                }
            });
        });

        let dir = __dirname + '/../../../out';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        for (let i = 0; i < attachments.length; i++) download(attachments[i]);

        if (attachments.length === 0) throw 'Couldn\'t find any images.';
        msg.channel.send(`:white_check_mark: ${attachments.length} images scraped and saved to the "out" folder in the SharpBot folder.`).then(m => { m.delete(10000); });
        msg.delete();
    }).catch(msg.error);
};

exports.info = {
    name: 'imagedumper',
    usage: 'imagedumper <amount>',
    description: 'Grabs all images from the specified amount of messages (max 100)',
    credits: '<@149916494183137280>' // Liam Bagge#0550
};

function download(url) {
    let file = fs.createWriteStream(`${__dirname}/../../../out/attachment_${path.basename(url)}`);
    got.stream(url).pipe(file);
}

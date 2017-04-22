const got = require('got');
const url = require('url');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must have something to upload!';
    }

    let parsed = bot.utils.parseArgs(args, 'r');

    msg.edit(':arrows_counterclockwise: Uploading...').then(() => {
        got.post(url.resolve('https://hastebin.com', 'documents'), {
            body: parsed.leftover.join(' '),
            json: true,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(res => {
            if (!res.body || !res.body.key) {
                msg.error('Failed to upload, no key was returned!');
                return;
            }
            let key = res.body.key || res.body;
            if (parsed.options.r) {
                msg.edit(`:white_check_mark: https://hastebin.com/raw/${key}`);
            } else {
                msg.edit(`:white_check_mark: https://hastebin.com/${key}`);
            }
        }).catch(err => {
            msg.error(`:no_entry_sign: Failed to upload: ${err}`, 5000);
        });
    });
};

exports.info = {
    name: 'haste',
    usage: 'haste [-r|--raw] <text>',
    description: 'Uploads some text to Hastebin'
};

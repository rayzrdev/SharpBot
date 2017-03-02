const got = require('got');
const url = require('url');

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must have something to upload!';
    }

    var raw = false;
    if (args[0] === '-r' || args[0] === '--raw') {
        args.shift();
        raw = true;
    }

    msg.edit(':arrows_counterclockwise: Uploading...').then(() => {
        got.post(url.resolve('https://hastebin.com', 'documents'), {
            body: args.join(' '),
            json: true,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(res => {
            if (!res.body || !res.body.key) {
                msg.error('Failed to upload, no key was returned!');
                return;
            }
            var key = res.body.key || res.body;
            if (raw) {
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
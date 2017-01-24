const got = require('got');
const url = require('url');

exports.run = (bot, msg, args) => {
    var raw = false;
    if (args[0] === '-r' || args[0] === '--raw') {
        raw = true;
        args = args.splice(1);
    }
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must have something to upload!').then(m => m.delete(2000));
        return;
    }

    msg.edit(':arrows_counterclockwise: Uploading...').then(m => {
        got.post(url.resolve('https://hastebin.com', 'documents'), {
            body: args.join(' '),
            json: true,
            headers: {
                'Content-Type': 'text/plain'
            }
        }).then(res => {
            if (!res.body || !res.body.key) {
                m.edit(':no_entry_sign: Failed to upload, no key was returned!').then(m => m.delete(2000));
                return;
            }
            var key = res.body.key || res.body;
            if (raw) {
                m.edit(`:white_check_mark: https://hastebin.com/raw/${key}`);
            } else {
                m.edit(`:white_check_mark: https://hastebin.com/${key}`);
            }
        }).catch(err => {
            m.edit(`:no_entry_sign: Failed to upload: ${err}`).then(m => m.delete(5000));
        });
    });
};

exports.info = {
    name: 'haste',
    usage: 'haste [-r|--raw] <text>',
    description: 'Uploads some text to Hastebin'
};
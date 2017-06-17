exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must have something to upload!';
    }

    let parsed = bot.utils.parseArgs(args, 'r');

    msg.edit(':arrows_counterclockwise: Uploading...').then(() => {
        bot.utils.gistUpload(parsed.leftover.join(' ')).then(({ url, rawUrl }) => {
            if (!url) {
                msg.error('Failed to upload, no key was returned!');
                return;
            }
            if (parsed.options.r) {
                msg.edit(`:white_check_mark: ${rawUrl}`);
            } else {
                msg.edit(`:white_check_mark: ${url}`);
            }
        }).catch(err => {
            msg.error(`:no_entry_sign: Failed to upload: ${err}`, 5000);
        });
    });
};

exports.info = {
    name: 'gist',
    usage: 'gist [-r|--raw] <text>',
    description: 'Uploads some text to a GitHub Gist'
};

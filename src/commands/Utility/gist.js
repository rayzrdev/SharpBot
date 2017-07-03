exports.run = async (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, 'r');

    if (parsed.leftover.length < 1) {
        throw 'You must have something to upload!';
    }

    await msg.edit(':arrows_counterclockwise: Uploading...');
    const { url, rawUrl } = await bot.utils.gistUpload(parsed.leftover.join(' '));

    if (!url) {
        throw 'Failed to upload, no key was returned!';
    }

    if (parsed.options.r) {
        msg.edit(`:white_check_mark: ${rawUrl}`);
    } else {
        msg.edit(`:white_check_mark: ${url}`);
    }
};

exports.info = {
    name: 'gist',
    usage: 'gist [-r|--raw] <text>',
    description: 'Uploads some text to a GitHub Gist'
};

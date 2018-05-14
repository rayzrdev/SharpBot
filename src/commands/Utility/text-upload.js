function makeCommand(name, displayName, methodName) {
    return {
        run: async (bot, msg, args) => {
            const parsed = bot.utils.parseArgs(args, 'r');

            if (parsed.leftover.length < 1) {
                throw 'You must have something to upload!';
            }

            await msg.edit(':arrows_counterclockwise: Uploading...');
            const { url, rawUrl } = await bot.utils[methodName](parsed.leftover.join(' '));

            if (!url) {
                throw 'Failed to upload, no key was returned!';
            }

            if (parsed.options.r) {
                msg.edit(`:white_check_mark: ${rawUrl}`);
            } else {
                msg.edit(`:white_check_mark: ${url}`);
            }
        },
        info: {
            name,
            usage: `${name} <text>`,
            description: `Uploads some text to ${displayName}`,
            options: [
                {
                    name: '-r',
                    description: 'Returns the URL for a raw version of your upload'
                }
            ]
        }
    };
}

module.exports = [
    makeCommand('haste', 'Hastebin', 'hastebinUpload'),
    makeCommand('ix', 'ix.io', 'ixUpload')
];

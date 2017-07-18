const got = require('got');

function makeCommand(type, url, transformer) {
    return {
        run: async (bot, msg) => {
            await msg.edit(':arrows_counterclockwise:');
            const res = await got(url);

            let file;
            try {
                file = transformer(res.body);
            } catch (ignore) {
                return msg.error('Failed to transform image URL!');
            }

            msg.delete();
            msg.channel.send({
                files: [
                    file
                ]
            });
        },
        info: {
            name: type,
            usage: type,
            description: `Sends a random ${type} image`
        }
    };
}

module.exports = [
    makeCommand('cat', 'http://random.cat/meow', body => JSON.parse(body).file),
    makeCommand('dog', 'http://random.dog/woof', body => `http://random.dog/${body}`)
];

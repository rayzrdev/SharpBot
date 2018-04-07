const got = require('got');

function makeCommand(type, url, transformer) {
    return {
        run: async (bot, msg) => {
            msg.edit(':arrows_counterclockwise:');
            const { body } = await got(url);

            let file;
            try {
                file = transformer(body);
            } catch (ignore) {
                return msg.error('Failed to transform image URL!');
            }

            msg.delete();
            msg.channel.send({ files: [file] });
        },
        info: {
            name: type,
            usage: type,
            description: `Sends a random ${type} image`
        }
    };
}

module.exports = [
    makeCommand('cat', 'http://thecatapi.com/api/images/get?format=xml', body => /<url>(.+?)<\/url>/.exec(body)[1]),
    makeCommand('dog', 'http://random.dog/woof', body => `http://random.dog/${body}`)
];

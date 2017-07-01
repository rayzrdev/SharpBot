const got = require('got');

function makeCommand(type, url, transformer) {
    return {
        run: (bot, msg) => {
            msg.edit(':arrows_counterclockwise:').then(() => {
                got(url).then(res => {
                    let file;
                    try {
                        file = transformer(res.body);
                    } catch (ignore) {
                        return msg.error('Failed to transform image URL!');
                    }

                    msg.delete();
                    msg.channel.send({ files: [file] });
                }).catch(msg.error);
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

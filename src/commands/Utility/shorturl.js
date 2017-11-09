var request = require('request');

const makeCommand = method => {
    return (bot, msg, args) => {
        if (args.length < 1) {
            throw 'Please provide a url to shorten!';
        }

        const parsed = bot.utils.parseArgs(args, ['e']);
        const url = parsed.leftover.join(' ');

        msg.delete()

        request('http://tinyurl.com/api-create.php?url=' + url, function (error, response, body) {
          msg.channel.send({
              embed: bot.utils.embed("URL: ", body)
          });
        });

    };
};

module.exports = [
    {
        run: makeCommand('shorturl'),
        info: {
            name: 'shorturl',
            aliases: ['short'],
            usage: 'short <url>',
            description: 'Shortens a url.',
            credits: 'xd <@335490180028956673>'
        }
    }
];

var giphy = require('giphy-api')();

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }
    giphy.random(`${params.join(" ")}`, function(err, res) {

        if (err) {
            throw err
        } else
            msg.edit(`**Wow!** :arrow_down:
${res.data.url}`)
    })
};

exports.info = {
    name: 'gif',
    usage: 'gif [search text]',
    description: 'Fetches From Giphy your demanded GIF.'
};

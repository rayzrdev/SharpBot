exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide something to search for!';
    }
    msg.edit(`**Wow!** :arrow_right: http://www.lmgtfy.com/?iie=1&q=${args.join('+')}`);
};

exports.info = {
    name: 'lmgtfy',
    usage: 'lmgtfy [search text]',
    description: 'Links to LMGTFY with the given search text'
};  
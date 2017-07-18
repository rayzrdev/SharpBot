exports.run = (bot, msg, args) => {
    let parsed = bot.utils.parseArgs(args, ['i']);

    if (parsed.leftover.length < 1) {
        throw 'You must provide something to search for!';
    }

    const query = encodeURIComponent(parsed.leftover.join(' '));
    // Are there better ways to do this? Sure. But why not abuse
    // JavaScript's craziness, and use a truthy/falsy -> 1/0 converter?
    const internetExplainer = !!parsed.options.i / 1;

    msg.edit(`**Wow!** :arrow_right: http://www.lmgtfy.com/?iie=${internetExplainer}&q=${query}`);
};

exports.info = {
    name: 'lmgtfy',
    usage: 'lmgtfy [search text]',
    description: 'Links to LMGTFY with the given search text',
    options: [
        {
            name: '-i',
            description: 'Enables Internet Explainer'
        }
    ]
};

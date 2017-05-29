exports.run = function(bot, msg, args) {
    if (args.length === 0) {
        throw 'You must input text to be transformed.';
    }
    msg.edit(args.map(arg => arg[0].toUpperCase() + arg.slice(1).toLowerCase()).join(' '));
};

exports.info = {
    name: 'initial',
    usage: 'initial <text>',
    description: 'Transforms the text you input into Initial Caps'
};

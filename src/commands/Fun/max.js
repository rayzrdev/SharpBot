

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        throw 'You must provide some text to be evil with!';
    }

    var output = unescapeEscapedEscapes(args.join(' '));
    output = output.repeat(2000 / output.length);
    msg.edit(output);
};

function unescapeEscapedEscapes(input) {
    return input.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\v/g, '\v');
}

exports.info = {
    name: 'max',
    usage: 'max <evil text>',
    description: 'Max-size text! >:D'
};
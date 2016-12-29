

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must provide some text to be evil with.').then(m => m.delete(2000));
        return;
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
    description: 'Makes your text be the max size of a Discord message'
};
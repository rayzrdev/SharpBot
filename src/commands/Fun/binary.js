exports.methods = {
    encode: input => {
        return input.toString().split('')
            .map(c => c.charCodeAt(0).toString(2));
    },
    decode: input => {
        let _input = typeof input === 'string' ? input.split(' ') : input;
        return _input.map(c => parseInt(c, 2))
            .map(c => String.fromCharCode(c))
            .join('');
    }
};

exports.run = (bot, msg, args) => {
    if (args.length < 2) {
        throw `Do \`${bot.config.prefix}help binary\` to see how to use this.`;
    }

    let input = args.slice(1).join(' ');

    if (args[0].match(/^e(nc(ode)?)?$/i)) {
        msg.edit(this.methods.encode(input).join(' '));
    } else if (args[0].match(/^d(ec(ode)?)?$/)) {
        msg.edit(this.methods.decode(input));
    } else {
        throw `Unknown sub command: \`${args[0]}\``;
    }
};

exports.info = {
    name: 'binary',
    usage: 'binary <encode|decode> <input>',
    description: 'Encodes/decodes your input to/from binary'
};

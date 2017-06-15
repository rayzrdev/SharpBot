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

    if (args[0].match(/^enc(ode(Text)?)?$/i)) {
        msg.edit(this.methods.encode(input).join(' '));
    } else if (args[0].match(/^dec(ode(Text)?)?$/i)) {
        msg.edit(this.methods.decode(input));
    } else if (args[0].match(/^decToBin$/i)) {
        if (isNaN(input)) {
            throw 'Input must be a number!';
        }

        msg.edit(parseInt(input).toString(2));
    } else if (args[0].match(/^binToDec$/i)) {
        if (isNaN(input)) {
            throw 'Input must be a number!';
        }

        msg.edit(parseInt(input, 2));
    } else {
        throw `Unknown sub command: \`${args[0]}\``;
    }
};

exports.info = {
    name: 'binary',
    usage: 'binary <encodeText|decodeText|decToBin|binToDec> <input>',
    description: 'Convert your input to/from binary'
};

exports.run = (bot, msg, args) => {
    var code = args.join(' ');

    var lang = '';

    if (args.length >= 2 && (args[0] === '-l' || args[0] === '--lang')) {
        lang = args[1];
        args.splice(2);
    }

    try {
        var evaled = eval(code);
        if (typeof evaled !== 'string')
            evaled = require('util').inspect(evaled);
        msg.channel.sendMessage(`\`\`\`${lang}\n${clean(evaled)}\n\`\`\``);
    } catch (err) {
        msg.channel.sendMessage(`:x: Error! \`\`\`xl\n${clean(err)}\n\`\`\``).then(m => m.delete(15000));
    }
};

function clean(text) {
    if (typeof (text) === 'string') {
        return text.replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203));
    }
    else {
        return text;
    }
}

exports.info = {
    name: 'eval',
    usage: 'eval <code>',
    description: 'Evaluates arbitrary JavaScript'
};
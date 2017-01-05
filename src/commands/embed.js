const utils = require('../utils');

exports.run = function (bot, msg, args) {
    if (args.length < 1) {
        msg.edit(':no_entry_sign: You must specify some text!').then(m => m.delete(2000));
        return;
    }

    msg.editEmbed(
        utils.embed('', args.join(' '), [], { footer: false })
    );
};

exports.info = {
    name: 'embed',
    usage: 'embed [text]',
    description: 'Sends a message via embeds'
};
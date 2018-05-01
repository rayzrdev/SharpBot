exports.run = function (bot, msg, args) {
    // insert code here
    msg.channel.send(`You typed: ${args.join(' ')}`);
};

exports.info = {
    name: '',
    usage: '',
    description: ''
};

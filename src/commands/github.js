exports.run = function (bot, msg, args) {
    if (args.length < 1 || args[0].indexOf('/') <= 0) {
        msg.edit(':no_entry_sign: You must specify a user and a repository!');
        return;
    }

    msg.edit(`:white_check_mark: \`${args[0]}\`: https://github.com/${args[0]}`);
};

exports.info = {
    name: 'github',
    usage: 'github user/repo',
    description: 'Links to a GitHub repository'
};
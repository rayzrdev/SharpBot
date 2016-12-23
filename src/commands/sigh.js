const ascii = `
\`\`\`

  _______   _________    _________   ,        ,
 /              |       /            |        |
|               |      |             |        |
|               |      |             |        |
 \\_____,        |      |  _______,   |________|
        \\       |      |         |   |        |
         |      |      |         |   |        |
         |      |      |         |   |        |
  ______/   ____|____   \\________|   |        |

\`\`\`
`;

exports.run = function(bot, msg) {
    msg.edit(ascii);
};

exports.info = {
    name: 'sigh',
    usage: 'sigh',
    description: 'Dramatic sigh text'
};
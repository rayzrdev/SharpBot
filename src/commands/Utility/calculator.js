const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide a equation to be solved on the calculator';
    }

    const question = args.join(' ');
    const answer = math.eval(question);

    if (answer) {
        msg.delete();
        msg.channel.sendEmbed(
            bot.utils.embed('', stripIndents`
                **Equation:**\n\`\`\`\n${question}\n\`\`\`
                **Answer:**\n\`\`\`\n${answer}\n\`\`\`
                `)
        ).catch(msg.error);
    }
};

exports.info = {
    name: 'calc',
    usage: 'calc <equation>',
    description: 'Calculates any math equation',
    credits: 'Carbowix',
};

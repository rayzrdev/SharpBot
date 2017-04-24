const math = require('math-expression-evaluator');
const stripIndents = require('common-tags').stripIndents;

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must provide a equation to be solved on the calculator';
    }

    let question = args.join(' ');
    msg.delete();
    msg.channel.sendMessage(':1234: **Calculating Your Question**...').then(() => {
        let evaled;
        try {
            evaled = math.eval(question);
        } catch (err) {
            throw err;
        }
        if (evaled) {
            msg.channel.sendEmbed(
                bot.utils.embed('', stripIndents`
                **Equation:**\n\`\`\`\n${question}\n\`\`\`
                **Answer:**\n\`\`\`\n${evaled}\n\`\`\`
                `)
            ).catch(msg.error);
        }
    });
};

exports.info = {
    name: 'calc',
    usage: 'calc <equation>',
    description: 'Calculates Any Math Equations',
    credits: 'Carbowix',
};

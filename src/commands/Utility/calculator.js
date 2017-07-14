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
        msg.channel.send({
            embed: bot.utils.embed('', stripIndents`
               \n\`\`\`\n${question} = ${answer}\n\`\`\` 
                :seven: :eight: :nine: :heavy_division_sign: 
                :four: :five: :six: :heavy_multiplication_x: 
                :one: :two: :three: :heavy_minus_sign: 
                :black_large_square: :zero: :black_large_square: :heavy_plus_sign:
                `)
        }).catch(msg.error);
    }
};

exports.info = {
    name: 'calc',
    usage: 'calc <equation>',
    description: 'Calculates any math equation',
    credits: 'Carbowix',
};

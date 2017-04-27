exports.run = function (bot, msg, args) {

    if(args.length < 1) {
        throw 'Please provide a secret message!';
    }

    let secretMessage = args.join(' ');

    msg.edit(`${secretMessage}\n[Self Destructs in 5 Seconds!]`).then(m => {
        
        bot.utils.playAnimation(m, 1000, [
            `${secretMessage}\n[Self Destructs in 4 Seconds!]`,
            `${secretMessage}\n[Self Destructs in 3 Seconds!]`,
            `${secretMessage}\n[Self Destructs in 2 Seconds!]`,
            `${secretMessage}\n[Self Destructs in 1 Seconds!]`,
            '[Poof]'
        ]);
    });

    msg.delete(7500);
};



exports.info = {
    name: 'destruct',
    usage: 'destruct <secret message>',
    description: 'Creates a self destructing secret message',
    credits: 'NITEHAWK'
};

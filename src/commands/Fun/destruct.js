exports.run = function(bot,msg,args) {

    const parsedArgs = bot.utils.parseArgs(args, ['d:','s:']);

    if(parsedArgs.leftover.length < 1) {
        throw 'Please provide a secret message';
    }

    let message = parsedArgs.leftover.join(' ');
    let delay = isNaN(parsedArgs.options.d) ? 5000 : parseInt(parsedArgs.options.d);
    delay = (delay < 100) ? 100 : delay;
    const style = (typeof parsedArgs.options.s === 'string') ? parsedArgs.options.s : 'plain';

    msg.delete();

    switch(style) {
    case 'embed':
        message = {
            embed: bot.utils.embed(
                `This message self-destructs in ${delay/1000} seconds.`,
                message,
                [],
                {
                    inline: true,
                    footer: 'Secret Message'
                }
            )
        };
        break;
    case 'inline':
        message = `*This message self-destructs in ${delay/1000} seconds.*\n${message}`;
        break;
    case 'code':
        message = `*This message self-destructs in ${delay/1000} seconds.*\n\`\`\`${message}\`\`\``;
        break;
    }

    msg.channel.send(message).then(m => m.delete(delay));

};


exports.info = {
    name: 'destruct',
    usage: 'destruct [-d delay in ms]  [-s <embed|inline|code|plain>] <message>',
    description: 'creates a self-destructing message',
    options:[
        {
            name: '-d',
            usage: '-d <delay in ms>',
            description: 'Sets the time (in ms) for the message to be deleted. (Default: 5 seconds)'
        },
        {
            name: '-s',
            usage: '-s <embed|inline|code|plain>',
            description: 'Sets the message style (default: plain)'
        }
    ],
    credits: '<@140541588915879936>' // Doxylamin#4539
};

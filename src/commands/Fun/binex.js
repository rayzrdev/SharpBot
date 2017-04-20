exports.run = (bot, msg, args) => {
    var a = parseInt(args[0]).toString(2);
    var b = parseInt(args[1]).toString(2);
    var len = Math.max(a.length, b.length);
    a = '0'.repeat(len - a.length) + a;
    b = '0'.repeat(len - b.length) + b;

    msg.channel.sendCode('xl', `
${a} ==> ${args[0]}
${b} ==> ${args[1]}

  ${a}
^ ${b}
-------
  ${(parseInt(a, 2) ^ parseInt(b, 2)).toString(2)}

==> ${(parseInt(a, 2) ^ parseInt(b, 2))}
    `);
};

exports.info = {
    name: 'binex',
    usage: 'binex <num1> <num2>',
    description: 'Explains binary crap'
};
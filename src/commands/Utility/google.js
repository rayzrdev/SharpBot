const request = require('request');
const cheerio = require('cheerio');

function getText(children) {
    if (children.children) return getText(children.children);
    return children.map(c => {
        return c.children ? getText(c.children) : c.data;
    }).join('');
}

exports.run = (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must enter something to search for!';
    }

    msg.delete();

    msg.channel.sendMessage(':arrows_counterclockwise: Searching...').then(m => {
        request.get('http://google.com/search?client=chrome&rls=en&ie=UTF-8&oe=UTF-8&q=' + args.join('+'), (err, res, body) => {
            if (err || res.statusCode !== 200) {
                return m.edit(`:no_entry_sign: Error! (${res.statusCode}): ${res.statusMessage}`);
            }

            let $ = cheerio.load(body);
            let results = [];
            $('.g').each((i) => {
                results[i] = {};
            });
            $('.g>.r>a').each((i, e) => {
                let raw = e.attribs['href'];
                results[i]['link'] = raw.substr(7, raw.indexOf('&sa=U') - 7);
            });
            $('.g>.s>.st').each((i, e) => {
                results[i]['description'] = getText(e);
            });

            let output = results.filter(r => r.link && r.description)
                .slice(0, 5)
                .map(r => `${r.link}\n\t${r.description}\n`)
                .join('\n');

            m.edit('', {
                embed: bot.utils.embed(`Search results for \`"${args.join(' ')}"\``, output)
            });
        });
    });
};

exports.info = {
    name: 'google',
    usage: 'google <search>',
    description: 'Searches Google using magic'
};

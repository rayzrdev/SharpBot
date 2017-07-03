const got = require('got');
const cheerio = require('cheerio');

const QUERY_STRING_SETTINGS = [
    'client=chrome',
    'rls=en',
    'ie=UTF-8',
    'oe=UTF-8'
].join('&');

function getText(children) {
    if (children.children) return getText(children.children);
    return children.map(c => {
        return c.children ? getText(c.children) : c.data;
    }).join('');
}

function decodeURL(input) {
    return input.replace(/%([0-9A-F]{2})/g, (match, code) => {
        return String.fromCharCode(parseInt(code, 16));
    });
}

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'You must enter something to search for!';
    }

    await msg.edit(':arrows_counterclockwise: Searching...');

    const res = await got(`https://google.com/search?${QUERY_STRING_SETTINGS}&q=${args.join('+')}`);
    if (res.statusCode !== 200) {
        return msg.edit(`:no_entry_sign: Error! (${res.statusCode}): ${res.statusMessage}`);
    }

    let $ = cheerio.load(res.body);
    let results = [];

    $('.g').each((i) => {
        results[i] = {};
    });

    $('.g>.r>a').each((i, e) => {
        let raw = e.attribs['href'];
        results[i]['link'] = decodeURL(raw.substr(7, raw.indexOf('&sa=U') - 7));
    });

    $('.g>.s>.st').each((i, e) => {
        results[i]['description'] = getText(e);
    });

    let output = results.filter(r => r.link && r.description)
        .slice(0, 5)
        .map(r => `${r.link}\n\t${r.description}\n`)
        .join('\n');

    msg.edit({
        embed: bot.utils.embed(`Search results for \`"${args.join(' ')}"\``, output)
    });
};

exports.info = {
    name: 'google',
    usage: 'google <search>',
    description: 'Searches Google using magic'
};

const escapeRegex = require('escape-string-regexp');

/*
Generating the inverse replacements isnt insanely expensive,
    but I feel bad repeating an O(n) operation on every call of run
 */
let _inverseReplacementsCached = null;
const getInverseReplacements = replacements => {
    if (_inverseReplacementsCached) {
        return _inverseReplacementsCached;
    }
    const inverseReplacements = new Map();
    Object.keys(replacements)
        .map(letter => {
            replacements[letter].forEach(replacement => {
                inverseReplacements.set(new RegExp(escapeRegex(replacement), 'gi'), letter);
            });
        });

    _inverseReplacementsCached = inverseReplacements;

    return inverseReplacements;
};

exports.run = function(bot, message, args) {
    const parsedArgs = bot.utils.parseArgs(args, ['e', 't']);

    if (parsedArgs.leftover.length < 1) {
        throw 'Provide text to be leeted.';
    }

    let parsed;

    if (parsedArgs.options.e) {
        const extendedLeetReplacements = {
            'a': ['4', '@', '/-\\', 'Д'],
            'b': ['ß'],
            'c': ['¢', '©'],
            'e': ['3', '€'],
            'f': ['ph', 'ƒ'],
            'g': ['6'],
            'i': ['1', '!'],
            'l': ['7'],
            'n': ['И', 'ท'],
            'q': ['Ø'],
            'r': ['®', 'Я'],
            's': ['5', '$', '§'],
            't': ['†'],
            'u': ['|_|', 'µ', 'บ'],
            'v': ['\\/'],
            'w': ['\\/\\/', 'VV', 'Ш', 'พ'],
            'x': ['Ж', '×'],
            'y': ['¥']
        };

        const inverseReplacements = getInverseReplacements(extendedLeetReplacements);
        if (parsedArgs.options.t) {
            parsed = parsedArgs.leftover.join(' ');

            for (let [replacement, origValue] of inverseReplacements) {
                parsed = parsed.replace(replacement, origValue);
            }
        } else {
            parsed = parsedArgs.leftover
                .join(' ')
                .replace(/[a-z]/gi, str => {
                    let selection = bot.utils.randomSelection(extendedLeetReplacements[str.toLowerCase()] || [str]);
                    selection = escapeRegex(selection);
                    return selection;
                });
        }
    } else {
        const simpleLeetReplacements = '4BCD3F6H1JKLMN0PQR57';
        if (parsedArgs.options.t) {
            parsed = parsedArgs.leftover.join(' ').replace(/[a-z0-9]/g, function(a) {
                let foundInReplacements = simpleLeetReplacements.indexOf(a);
                if (foundInReplacements === -1) {
                    return a;
                }
                return String.fromCharCode(97 + foundInReplacements);
            });
        } else {
            parsed = parsedArgs.leftover.join(' ').replace(/[a-z]/g, function f(a) {
                return simpleLeetReplacements[parseInt(a, 36) - 10] || a.replace(/[a-t]/gi, f);
            }).toLowerCase();
        }
    }

    message.delete();
    message.channel.send(parsed);
};

exports.info = {
    name: 'leet',
    usage: 'leet <text>',
    description: 'Talk like true gamers',
    options: [
        {
            name: '-e',
            usage: '-e',
            description: 'Use extended l33t $p3@k'
        },
        {
            name: '-t',
            usage: '-t',
            description: 'Translate from leet speak into English'
        }
    ]
};

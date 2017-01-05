const bot = require('./bot');

// Color-related constants
const rgbToHex = /rgb\((\s*\d{1,3}(\s*,\s*\d{1,3}){2}\s*)\)/;

const simpleColors = {
    'white': '#FFFFFF',
    'black': '#000000',
    'red': '#FF0000',
    'green': '#00FF00',
    'blue': '#0000FF',
    'yellow': '#FFFF00',
    'pink': '#FF00FF',
    'cyan': '#00FFFF'
};

exports.randomSelection = function() {
    return String(arguments[Math.floor(Math.random() * arguments.length)]);
};

exports.randomColor = function() {
    return `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
};

var randomFooter = function() {
    return exports.randomSelection(
        'just add water!',
        'Powered by squirrels!',
        'codeisluvcodeislife',
        'Where did you get that?',
        'WHAT DID YOU BREAK!?',
        'D-D-D-DROP THE BASS',
        'Eat, Sleep, Dubstep'
    );
};

exports.embed = (title, description = '', fields = [], options = {}) => {
    let url = options.url || '';
    let timestamp = options.timestamp || false;
    let color = this.getColor(options.color || this.randomColor());
    let footer = options.footer === undefined ? true : options.footer;

    if (options.inline) fields = fields.map(obj => { obj.inline = true; return obj; });
    if (fields.length > 0) fields.push({ name: '\u200b', value: '\u200b' });
    if (url !== '') description += '\n';

    return {
        color,
        title,
        fields,
        description,
        url,
        video: { url },
        image: { url },
        timestamp: timestamp ? new Date() : null,
        footer: !footer ? null : {
            text: randomFooter(),
            icon_url: bot.client.user.avatarURL
        }
    };
};

exports.hexToDec = function(hexInput) {
    if (typeof hexInput === 'number') return hexInput;
    if (typeof hexInput !== 'string') return 0;
    if (hexInput.startsWith('#')) hexInput = hexInput.substr(1);
    return parseInt(hexInput, 16);
};

exports.rgbToHex = function(rgb) {
    if (typeof rgb !== 'string') return '#000000';
    if (!rgbToHex.test(rgb)) return '#000000';
    return '#' + rgb.replace(rgbToHex, '$1').split(',')
        .map(num => parseInt(num.trim()).toString(16))
        .map(num => num.length < 2 ? '0'.repeat(2 - num.length) + num : num)
        .map(num => num.length > 2 ? 'FF' : num)
        .join('').toUpperCase();
};

exports.getColor = function(input) {
    if (typeof input === 'number') { console.log(`Input: ${input}`); return input; }
    if (typeof input !== 'string') return 0;
    if (rgbToHex.test(input)) input = this.rgbToHex(input); // This falls into the next if
    if (input.startsWith('#')) return this.hexToDec(input);
    if (typeof simpleColors[input.toLowerCase()] === 'string')
        return this.getColor(simpleColors[input.toLowerCase()]);
    return 0;
};
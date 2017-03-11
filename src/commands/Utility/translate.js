const translate = require('google-translate-api');


exports.run = function(bot, msg, args) {

var quotes = msg.content.split('"');
var text = quotes[1] ? quotes[1] : ""
var lang = quotes[3] ? quotes[3]: ""    

if (!text){
	return msg.channel.sendMessage(`:x: You failed to do the Correct Syntax. **Syntax**: ${bot.config.prefix}trans "text" "lang". Don't Forget the Quotations`)
}else

msg.channel.sendMessage("**Translating your Text...**").then(m => {

translate(`${text}`, {to: `${lang}`}).then(res => {

msg.channel.sendMessage('', { embed: bot.utils.embed('', translate()) })



function translate() {
    return `**Your Text:** ${text}
**Language Detected**: ${res.from.language.iso}
**Translation To**: ${lang}
**Translation**: ${res.text}`;
}
}).catch(err => {
console.error(err);
m.edit(":x: Error Has Occurred:", err);               
})
})
}
exports.info = {
    name: 'trans',
    usage: 'trans "text" "lang" ',
    description: 'Translate Your Language to any other Language you want.'
};
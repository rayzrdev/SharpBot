var yts = require('youtube-scrape')

function rnd_selection(base) {
    return String(arguments[Math.floor(Math.random() * arguments.length)]);
}

exports.run = (bot, msg, args) => {

    yts(`${args.join(' ')}`).then((data) => {

        const embed = new Discord.RichEmbed()
            .setTitle('Search Results')
            .setAuthor(message.author.username, message.author.displayAvatarURL)
            .setColor(0x00AE86)
            .setThumbnail('${data.results[0].thumbnail}')
            .setDescription(`[${data.results[0].title}](${data.results[0].link})`)
            .addField(`:information: More Information`, `:eyes: **Views**: ${data.results[0].views} views\n\u200B:alarm_clock: **Length**: ${data.results[0].length}`)
            .setTimestamp()
        msg.channel.sendEmbed(
            embed, {
                disableEveryone: true
            }
        );
    })
}

exports.info = {
    name: 'yt',
    usage: 'yt <terms>',
    description: 'Fetches a Youtube video Details'
};

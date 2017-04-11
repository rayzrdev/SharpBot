var yts = require('youtube-scrape')

function rnd_selection(base)
{
	return String(arguments[Math.floor(Math.random()*arguments.length)]);
}

exports.run = (bot, msg, args) => {
 
yts(`${args.join(' ')}`).then((data) => {
 msg.edit('', {
				embed: {
					color: 
					rnd_selection(3447003, 14365491, 3201849, 13818670, 13577435, 7089371, 14383916),
					author: {
						name: msg.author.username,
						icon_url: msg.author.displayAvatarURL
					},
          image: {url: data.results[0].thumbnail},
          description: `[${data.results[0].title}](${data.results[0].link})`,
					thumbnail: {
						url: ('https://lh3.googleusercontent.com/dUsfnDQJZt2v9d1n2tWsPZiYLLmOQkjv3R4rbsTw83lYGo2cQe8u2z-0YQPxmmcgkL8d=w170')
					},

          fields: [
						{
							name: 'More Information:',
							value: `:eyes: **Views**: ${data.results[0].views} views\n\u200B:alarm_clock: **Length**: ${data.results[0].length}
              `
						}
					],
					timestamp: new Date()
				}
			});
   })	 
}

exports.info = {
    name: 'yt',
    usage: 'yt <terms>',
    description: 'Fetches a Youtube video Details'
};

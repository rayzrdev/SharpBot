const { RichEmbed } = require('discord.js');
const got = require('got');

exports.run = function (bot, msg, args) {
    if(args.length < 1) {
        throw 'Please provide a city';
    }
    const city = args.join(' ');
    got(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`)
    .then(resp => {
        let weatherinfo = JSON.parse(resp.body).query.results.channel;
        const e = new RichEmbed()
            .setColor(bot.utils.randomColor())
            .setTitle(weatherinfo.item.title)
            .setDescription(`The current temperature in ${weatherinfo.location.city} is ${weatherinfo.item.condition.temp}°F/${Math.round(((weatherinfo.item.condition.temp-32)*5)/9)}°C`)
            .setFooter('Thanks to the Yahoo Weather API')
            .setTimestamp()
            .addField('Condition', weatherinfo.item.condition.text, true)
            .addField('Humidity', weatherinfo.atmosphere.humidity, true)
            .addField(':wind_blowing_face: Wind', `*${weatherinfo.wind.speed}mph* ; direction: *${weatherinfo.wind.direction}°*`, true)
            .addField(`Forecast for today is *${weatherinfo.item.forecast[0].text}*`,
                 `Highest temp is ${weatherinfo.item.forecast[0].high}°F/${Math.round(((weatherinfo.item.forecast[0].high-32)*5)/9)}°C; Lowest temp is ${weatherinfo.item.forecast[0].low}°F/${Math.round(((weatherinfo.item.forecast[0].low-32)*5)/9)}°C`, true)
            .addBlankField(true)
            .addField(':sunrise: Sunrise', weatherinfo.astronomy.sunrise, true)
            .addField(':city_sunset: Sunset', weatherinfo.astronomy.sunset, true);
        msg.edit({embed: e}).catch(err => { throw err; });
    }).catch(() => msg.error('Failed to load weather data'));
};

exports.info = {
    name: 'weather',
    usage: 'weather <city>',
    description: 'Shows weather info for city'
};

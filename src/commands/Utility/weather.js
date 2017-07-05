const got = require('got');

exports.run = function (bot, msg, args) {
    if(args.length < 1) {
        throw 'Please provide a city';
    }
    const city = args.join(' ');
    got(`https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${city}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`)
    .then(resp => {
        let weatherinfo = JSON.parse(resp.body).query.results.channel;
        let description = `The current temperature in ${weatherinfo.location.city} is ${weatherinfo.item.condition.temp}°F/${Math.round(((weatherinfo.item.condition.temp-32)*5)/9)}°C`;
        const embed = bot.utils.embed(weatherinfo.item.title, description, [
            {
                name: 'Condition',
                value: weatherinfo.item.condition.text
            },
            {
                name: 'Humidity',
                value: weatherinfo.atmosphere.humidity + '%'
            },
            {
                name: ':wind_blowing_face: Wind',
                value: `*${weatherinfo.wind.speed}mph* ; direction: *${weatherinfo.wind.direction}°*`
            },
            {
                name: `Forecast for today is *${weatherinfo.item.forecast[0].text}*`,
                value: `Highest temp is ${weatherinfo.item.forecast[0].high}°F/${Math.round(((weatherinfo.item.forecast[0].high-32)*5)/9)}°C; Lowest temp is ${weatherinfo.item.forecast[0].low}°F/${Math.round(((weatherinfo.item.forecast[0].low-32)*5)/9)}°C`
            },
            {
                name: '\u200B',
                value: '\u200B'
            },
            {
                name: ':sunrise: Sunrise',
                value: weatherinfo.astronomy.sunrise
            },
            {
                name: ':city_sunset: Sunset',
                value: weatherinfo.astronomy.sunset
            }
        ], { inline: true });
        msg.edit({embed: embed});
    }).catch(() => msg.error('Failed to load weather data'));
};

exports.info = {
    name: 'weather',
    usage: 'weather <city>',
    description: 'Shows weather info for city'
};

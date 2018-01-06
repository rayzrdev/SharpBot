const got = require('got');
const countries = require('country-data').countries.all;

const makeURL = (city) => `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22${encodeURIComponent(city)}%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys`;
const celsius = (fahrenheit) => Math.round(((fahrenheit - 32) * 5) / 9);

const spacer = {
    name: '\u200b',
    value: '\u200b',
};

exports.run = async (bot, msg, args) => {
    if (args.length < 1) {
        throw 'Please provide a city.';
    }

    const city = args.join(' ');
    const res = await got(makeURL(city), { json: true });

    if (!res || !res.body || !res.body.query || !res.body.query.results || !res.body.query.results.channel) {
        throw 'Failed to load weather info!';
    }

    const weatherInfo = res.body.query.results.channel;
    const forecast = weatherInfo.item.forecast[0];

    const countryInfo = countries.find(country => country.name === weatherInfo.location.country);
    const countryEmoji = countryInfo ? countryInfo.emoji : ':grey_question:';

    const description = `The current temperature in ${weatherInfo.location.city} is ${weatherInfo.item.condition.temp}°F/${celsius(weatherInfo.item.condition.temp)}°C`;

    const embed = bot.utils.embed(`${countryEmoji} ${weatherInfo.item.title}`, description, [
        {
            name: 'Condition',
            value: weatherInfo.item.condition.text
        },
        {
            name: 'Humidity',
            value: weatherInfo.atmosphere.humidity + '%'
        },
        {
            name: ':wind_blowing_face: Wind',
            value: `*${weatherInfo.wind.speed}mph* ; direction: *${weatherInfo.wind.direction}°*`
        },
        {
            name: `Forecast for today is *${forecast.text}*`,
            value: `Highest temp is ${forecast.high}°F/${celsius(forecast.high)}°C, lowest temp is ${forecast.low}°F/${celsius(forecast.low)}°C`,
        },
        spacer,
        spacer,
        spacer,
        spacer,
        {
            name: ':sunrise: Sunrise',
            value: weatherInfo.astronomy.sunrise
        },
        {
            name: ':city_sunset: Sunset',
            value: weatherInfo.astronomy.sunset
        }
    ], { inline: true });

    msg.edit({ embed });
};

exports.info = {
    name: 'weather',
    usage: 'weather <city>',
    description: 'Shows weather info for city'
};

const weather = require('weather-js');
const stripIndents = require('common-tags').stripIndents;

exports.run = function(bot, msg, args) {

    if(args.length < 2) {
        throw 'Please provide a unit and location!';
    }

    let parsed = bot.utils.parseArgs(args, ['f', 'c']);

    let location = parsed.leftover.join(' ');

    if(parsed.options.f) {

        weather.find({search: location, degreeType: 'F'}, function(err, result) {

            if(err) console.log(err);

            msg.delete();
            msg.channel.sendEmbed(

                bot.utils.embed(
                    `Current Weather for ${result[0].location.name}`,
                    stripIndents`
                    ***This message will dissappear in 30 seconds.***`,
                    [
                        {
                            name: 'Location:',
                            value: `${result[0].location.name}`
                        },
                        {
                            name: 'Last Updated:',
                            value: `${result[0].current.shortday}, ${result[0].current.date} at ${result[0].current.observationtime}`
                        },
                        {
                            name: 'Temperature:',
                            value: `${result[0].current.temperature}`
                        },
                        {
                            name: 'Feels Like:',
                            value: `${result[0].current.feelslike}`
                        },
                        {
                            name: 'Condition:',
                            value: `${result[0].current.skytext}`
                        },
                        {
                            name: 'Wind:',
                            value: `${result[0].current.winddisplay}`
                        },
                        {
                            name: 'Humidity:',
                            value: `${result[0].current.humidity}`
                        }
                    ],
                    {
                        footer: 'Weather by NITEHAWK'
                    }
            )

        ).then(m => m.delete(30000));
            return;
        });
    }

    if(parsed.options.c) {

        weather.find({search: location, degreeType: 'C'}, function(err, result) {

            if(err) console.log(err);

            msg.delete();
            msg.channel.sendEmbed(

                bot.utils.embed(
                    `Current Weather for ${result[0].location.name}`,
                    stripIndents`
                    ***This message will dissappear in 30 seconds.***`,
                    [
                        {
                            name: 'Location:',
                            value: `${result[0].location.name}`
                        },
                        {
                            name: 'Last Updated:',
                            value: `${result[0].current.shortday}, ${result[0].current.date} at ${result[0].current.observationtime}`
                        },
                        {
                            name: 'Temperature:',
                            value: `${result[0].current.temperature}`
                        },
                        {
                            name: 'Feels Like:',
                            value: `${result[0].current.feelslike}`
                        },
                        {
                            name: 'Condition:',
                            value: `${result[0].current.skytext}`
                        },
                        {
                            name: 'Wind:',
                            value: `${result[0].current.winddisplay}`
                        },
                        {
                            name: 'Humidity:',
                            value: `${result[0].current.humidity}`
                        }
                    ],
                    {
                        footer: 'Weather by NITEHAWK'
                    }
            )

        ).then(m => m.delete(30000));
            return;
        });
    }
};

exports.info = {
    name: 'current',
    usage: 'current <-f or -c> <location>',
    description: 'Gets the current weather of the given location in the given unit',
    credit: 'NITEHAWK'
};

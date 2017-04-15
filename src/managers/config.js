const prompt = require('prompt');
const chalk = require('chalk');
const stripIndents = require('common-tags').stripIndents;

const fse = require('fs-extra');
const path = require('path');

prompt.message = '';
prompt.delimiter = chalk.green(' >');

const questions = {
    properties: {
        botToken: {
            pattern: /^"?[a-zA-Z0-9_\.\-]+"?$/,
            type: 'string',
            message: 'Token can only contain letters, numbers, underscores and dashes',
            required: true,
            hidden: true,
            replace: '*',
            before: value => value.replace(/"/g, '')
        },
        prefix: {
            type: 'string',
            default: '//',
            required: false
        }
    }
};

class ConfigManager {
    constructor(bot, base) {
        this.bot = bot;
        this.base = base;
    }

    load() {
        var configFile = path.resolve(this.base, '../config.json');

        if (!fse.existsSync(configFile)) {
            console.log(stripIndents`
            ${chalk.gray('----------------------------------------------------------')}
            ${chalk.gray('==============<') + chalk.yellow(' SharpBot Setup Wizard v1.0 ') + chalk.gray('>==============')}
            ${chalk.gray('----------------------------------------------------------')}
            
            To get your token, see the instructions at ${chalk.green('https://github.com/Rayzr522/SharpBot#getting-your-user-token')}

            Please enter your ${chalk.yellow('bot token')} and desired ${chalk.yellow('command prefix')} for the bot:
            \u200b
            `);

            prompt.get(questions, (err, res) => {
                if (!res) {
                    process.exit(666);
                }

                res.blacklistedServers = res.blacklistedServers || [
                    '226865538247294976',
                    '239010380385484801'
                ];

                fse.writeJSONSync(configFile, res);
                process.exit(42);
            });
            return null;
        }

        return require(configFile);
    }
}

module.exports = ConfigManager;
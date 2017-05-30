const prompt = require('prompt');
const chalk = require('chalk');
const stripIndents = require('common-tags').stripIndents;
const dateFormat = require('dateformat');

const fse = require('fs-extra');
const path = require('path');

prompt.message = '';
prompt.delimiter = chalk.green(' >');

const getQuestions = currentConfig => ({
    properties: {
        botToken: {
            pattern: /^"?[a-zA-Z0-9_\.\-]+"?$/,
            type: 'string',
            message: 'Token can only contain letters, numbers, underscores and dashes',
            // Only require a token if one isnt already configured
            required: !currentConfig.botToken,
            // This will show up in the prompt as (<default hidden>)
            default: currentConfig.botToken,
            hidden: true,
            replace: '*',
            before: value => value.replace(/"/g, '')
        },
        prefix: {
            type: 'string',
            default: currentConfig.prefix || '//',
            required: false
        }
    }
});

class ConfigManager {
    constructor(bot, base) {
        this._bot = bot;
        this._base = base;

        this._configPath = path.resolve(base, '../data/configs/config.json');
    }

    load(reconfiguring = false) {
        if (reconfiguring || !fse.existsSync(this._configPath)) {
            console.log(stripIndents`
            ${chalk.gray('----------------------------------------------------------')}
            ${chalk.gray('==============<') + chalk.yellow(' SharpBot Setup Wizard v1.0 ') + chalk.gray('>==============')}
            ${chalk.gray('----------------------------------------------------------')}

            To get your token, see the instructions at ${chalk.green('https://github.com/Rayzr522/SharpBot#getting-your-user-token')}

            ${chalk.blue('Note:')} ${chalk.green('yarn run config')} can be run at any time to re-run this setup.

            Please enter your ${chalk.yellow('bot token')} and desired ${chalk.yellow('command prefix')} for the bot:
            \u200b
            `);

            let currentConfig = this._config || {};
            if (reconfiguring && fse.existsSync(this._configPath)) {
                currentConfig = fse.readJSONSync(this._configPath);
            }

            prompt.get(getQuestions(currentConfig), (err, res) => {
                if (!res) {
                    process.exit(666);
                }

                res.blacklistedServers = res.blacklistedServers || [
                    '226865538247294976',
                    '239010380385484801'
                ];

                fse.writeJSONSync(this._configPath, res);
                // If this is running as the configure script, then we want a non-error return code
                process.exit(reconfiguring ? 0 : 42);
            });
            return null;
        }

        this._config = fse.readJSONSync(this._configPath);

        return this._config;
    }

    _backup() {
        const backupPath = `${this._configPath}.${dateFormat('dd-mm-yy-HH-MM-ss')}.bak`;
        fse.copySync(this._configPath, backupPath);

        return backupPath;
    }

    save() {
        const backupPath = this._backup();

        try {
            fse.writeJSONSync(this._configPath, this._config);
            fse.removeSync(backupPath);
        } catch (e) {
            this._bot.logger.severe('Failed to save config file!');
        }
    }

    set(key, value) {
        // Convert to string if it's not a string already
        const realKey = `${key}`;
        this._config[realKey] = value;

        this.save();
    }
}

module.exports = ConfigManager;

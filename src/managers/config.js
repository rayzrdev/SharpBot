const inquirer = require('inquirer');
const chalk = require('chalk');
const stripIndents = require('common-tags').stripIndents;
const dateFormat = require('dateformat');

const fse = require('fs-extra');
const path = require('path');

class ConfigManager {
    constructor(bot, base, dynamicImports, overrides = {}) {
        this._bot = bot;
        this._base = base;

        this._configPath = path.resolve(global.settings.configsFolder, 'config.json');

        this._dynamicImports = dynamicImports;

        this._overrides = overrides;
    }

    getQuestions(currentConfig, optionalConfigs) {
        const questions = [
            {
                name: 'botToken',
                type: 'password',
                message: 'What is your token? (Token can only contain letters, numbers, underscores and dashes)',
                validate: input => /^(<default hidden>)|("?[a-zA-Z0-9_.-]+"?)$/.test(input),
                filter: input => input.replace('<default hidden>', currentConfig.botToken).replace(/"/g, ''),
                // Only require a token if one isnt already configured
                default: currentConfig.botToken ? '<default hidden>' : undefined
            },
            {
                name: 'prefix',
                type: 'input',
                message: 'What would you like your command prefix to be?',
                default: currentConfig.prefix || '//'
            }
        ];

        Object.keys(optionalConfigs).forEach(configName => {
            const config = optionalConfigs[configName];
            const question = config.getQuestion(currentConfig, configName);
            if (!question) {
                return;
            }
            question.description = (question.description || configName) + ' (Optional)';
            questions.push(question);
        });

        return questions;
    }

    load(reconfiguring = false) {
        const exit = (restart = true) => !reconfiguring && this._bot.shutdown(restart);
        const fail = () => reconfiguring ? process.exit(1) : exit(false);

        if (reconfiguring || !fse.existsSync(this._configPath)) {
            // Just a quick hack, we don't want any special formatting.
            (console._original || console).log(stripIndents`
            ${chalk.gray('----------------------------------------------------------')}
            ${chalk.gray('==============<') + chalk.yellow(' SharpBot Setup Wizard v1.0 ') + chalk.gray('>==============')}
            ${chalk.gray('----------------------------------------------------------')}

            To get your token, see the instructions at ${chalk.green('https://github.com/Rayzr522/SharpBot#getting-your-user-token')}

            ${chalk.blue('Note:')} ${chalk.green('sharpbot --config')} can be run at any time to re-run this setup.

            Please enter your ${chalk.yellow('bot token')} and desired ${chalk.yellow('command prefix')} for the bot:
            \u200b
            `);

            let currentConfig = this._config || {};
            if (reconfiguring && fse.existsSync(this._configPath)) {
                currentConfig = fse.readJSONSync(this._configPath);
            }

            inquirer.prompt(this.getQuestions(currentConfig, this._dynamicImports.optionalConfigs)).then(res => {
                res.blacklistedServers = res.blacklistedServers || [
                    '226865538247294976',
                    '239010380385484801'
                ];

                try {
                    fse.writeJSONSync(this._configPath, res);
                } catch (e) {
                    console.error(`Couldn't write config to ${this._configPath}\n${e.stack}`);
                    return fail();
                }

                return exit(true);
            }).catch(err => {
                console.error(err);
                return fail();
            });

            return null;
        }

        this._config = fse.readJSONSync(this._configPath);

        Object.assign(this._config, this._overrides);

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

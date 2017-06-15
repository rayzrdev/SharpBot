const discord = require('discord.js');
const chalk = require('chalk');
const NotificationManager = require('../managers/notifications');

class AssistantBot {

    constructor(selfBot) {
        this.selfBot = selfBot;
        this.assistantBot = new discord.Client();
        this.botReady = false;

        this.init();
    }

    init() {
        this.assistantBot.on('ready', () => {
            this.botReady = true;
        });

        this.assistantBot.on('exit', () => {
            this.botReady && this.assistantBot.destroy();
        });

        if (this.selfBot.config[AssistantBot.CONFIG_NAME]) {
            this.assistantBot.login(this.selfBot.config[AssistantBot.CONFIG_NAME])
                .catch(err => {
                    if (err.message === 'Incorrect login details were provided.') {
                        console.error(`Incorrect token provided for ${AssistantBot.CONFIG_NAME}. Please run ${chalk.green('yarn run config')} to correct it.`);
                    }
                });
        }
    }

    notify(title, message) {
        let user = this.assistantBot.users.get(this.selfBot.user.id);
        if (!user) {
            user = this.assistantBot.fetchUser(this.selfBot.user.id);
        }
        return Promise.resolve(user)
            .then(user => {
                if (!user) {
                    throw new Error(`${AssistantBot.PLUGIN_NAME} is unable to fetch user`);
                }
                return user.send({
                    embed: this.selfBot.utils.embed(title, message)
                });
            })
            .catch(e => {
                console.error(`${AssistantBot.PLUGIN_NAME} is unable to send message to user`, e.message);
            });
    }

    isReady() {
        return this.botReady;
    }
}

AssistantBot.CONFIG_NAME = 'assistantBotToken';
AssistantBot.PLUGIN_NAME = 'assistant-bot';

module.exports = {
    name: AssistantBot.PLUGIN_NAME,
    configs: [{
        name: AssistantBot.CONFIG_NAME,
        getQuestion(/*currentConfig, configName*/) {
            // Until it's actually implemented...
            /*
            return {
                pattern: /^"?[a-zA-Z0-9_\.\-]+"?$/,
                type: 'string',
                message: 'Token can only contain letters, numbers, underscores and dashes',
                // Only require a token if one isnt already configured
                required: false,
                // This will show up in the prompt as (<default hidden>)
                default: currentConfig[configName],
                hidden: true,
                replace: '*',
                before: value => value.replace(/"/g, '')
            };
            */
        }
    }],
    run: bot => new AssistantBot(bot),
    pluginTypes: [NotificationManager.PLUGIN_TYPE]
};

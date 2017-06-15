const path = require('path');
const chalk = require('chalk');
const didYouMean = require('didyoumean2');

class CommandManager {
    constructor(bot) {
        this.bot = bot;
        this._commands = [];
        this._categories = [];
    }

    _validateCommand(object) {
        if (typeof object !== 'object')
            return 'command setup is invalid';
        if (typeof object.run !== 'function')
            return 'run function is missing';
        if (typeof object.info !== 'object')
            return 'info object is missing';
        if (typeof object.info.name !== 'string')
            return 'info object is missing a valid name field';
        return null;
    }

    loadCommands() {
        this._commands = [];
        this._categories = [];

        const bot = this.bot;

        const commandImports = bot.managers.dynamicImports.getImport('commands');
        Object.keys(commandImports).forEach(file => {
            let command = commandImports[file];
            let name = path.basename(file);

            if (command instanceof Array) {
                command.forEach((e, i) => this._validateAndLoad(e, file, `${name}.${i}`));
            } else {
                this._validateAndLoad(command, file, name);
            }
        });
    }

    _validateAndLoad(command, file, name) {
        let error = this._validateCommand(command);

        if (error) {
            return this.bot.logger.severe(`Failed to load '${name}': ${chalk.red(error)}`);
        }

        if (!command.category) {
            // TODO: Any better way to do this?
            let base = path.join(this.bot.managers.dynamicImports.base, 'commands');

            let category = 'Uncategorized';
            if (file.indexOf(path.sep) > -1) {
                category = path.dirname(path.relative(base, file))
                    .replace(new RegExp(path.sep.replace('\\', '\\\\'), 'g'), '/');
            }

            command.info.category = category;

            if (this._categories.indexOf(category) === -1)
                this._categories.push(category);
        }

        if (typeof command.init === 'function') {
            try {
                command.init(this.bot);
            } catch (err) {
                return this.bot.logger.severe(`Failed to init '${name}':`, err);
            }
        }

        this._commands.push(command);
    }

    all(category) {
        return !category ? this._commands : this._commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase());
    }

    categories() {
        return this._categories;
    }

    get(name) {
        return this.findBy('name', name)
            || this._commands.find(command => command.info.aliases instanceof Array && command.info.aliases.indexOf(name) > -1);
    }

    findBy(key, value) {
        return this._commands.find(c => c.info[key] === value);
    }

    handleCommand(msg, input) {
        const prefix = this.bot.config.prefix;
        if (!input.startsWith(prefix)) return;

        let split = input.substr(prefix.length).trim().split(' ');
        let base = split[0].toLowerCase();
        let args = split.slice(1);

        // Try to find a built in command first
        let command = this.get(base);

        if (command) {
            return this.execute(msg, command, args);
        } else {
            return this._handleShortcuts(msg, base, args);
        }

        // Temporarily disabled
    }

    _handleShortcuts(msg, name, shortcutArgs) {
        // If that fails, look for a shortcut
        const shortcut = this.bot.storage('shortcuts').get(name);

        if (!shortcut) {
            // If no shortcuts could be found either, try finding the closest command
            const maybe = didYouMean(name, this.all().map(c => c.info.name), {
                threshold: 5,
                thresholdType: 'edit-distance'
            });

            if (maybe) {
                return msg.edit(`:question: Did you mean \`${this.bot.config.prefix}${maybe}\`?`).then(m => m.delete(5000));
            } else {
                return msg.edit(`:no_entry_sign: No commands were found that were similar to \`${this.bot.config.prefix}${name}\``)
                    .then(m => m.delete(5000));
            }
        }

        const commands = shortcut.command.split(';;');

        return Promise.all(
            commands.map(c => c.trim()).filter(c => c.length > 0).map(commandString => {
                const base = commandString.split(' ')[0].toLowerCase();
                const args = commandString.split(' ').splice(1).concat(shortcutArgs);

                const command = this.get(base);

                if (command) {
                    return this.execute(msg, command, args);
                } else {
                    return msg.edit(`:no_entry_sign: The shortcut \`${shortcut.name}\` is improperly set up!`)
                        .then(m => m.delete(2000));
                }
            })
        );
    }

    execute(msg, command, args) {
        msg.editEmbed = ((embed) => msg.edit('', { embed })).bind(msg);

        msg.error = ((message, delay) => {
            if (message.message === 'Not Found') {
                // Kinda sick of these :\
                return;
            }

            let displayMessage = message.message || message;

            this.bot.logger.severe(message);
            msg.edit(`:x: ${displayMessage || 'Something failed!'}`)
                .then(m => m.delete(delay || 2000));
        }).bind(msg);

        // return Promise.resolve(command.run(this.bot, msg, args));
        try {
            const returned = command.run(this.bot, msg, args);
            return Promise.resolve(returned);
        } catch (err) {
            msg.error(err);
            return Promise.resolve();
        }
    }
}

module.exports = CommandManager;

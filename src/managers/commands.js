const path = require('path');
const chalk = require('chalk');

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

    execute(msg, command, args) {
        msg.editEmbed = ((embed) => msg.edit('', { embed })).bind(msg);
        msg.error = ((message, delay) => {
            if (message.message) message = message.message;

            this.bot.logger.severe(message.toString());
            msg.edit(`:x: ${message || 'Something failed!'}`)
                .then(m => m.delete(delay || 2000));
        }).bind(msg);

        try {
            command.run(this.bot, msg, args);
        } catch (e) {
            msg.error(e);
        }
    }

}

module.exports = CommandManager;

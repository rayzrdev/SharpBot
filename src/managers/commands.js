const path = require('path');
const chalk = require('chalk');
const read = require('readdir-recursive');

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

    loadCommands(folder) {
        this._commands = [];
        this._categories = [];

        const bot = this.bot;

        read.fileSync(folder).forEach(file => {
            file = file.substr(folder.length + 1);
            let basename = path.basename(file);

            if (basename.startsWith('_') || !basename.endsWith('.js')) return;

            let command = require(`${folder}/${file}`);
            let error = this._validateCommand(command);
            if (error) {
                return bot.logger.severe(`Failed to load '${file}': ${chalk.red(error)}`);
            }

            if (!command.category) {
                let category = file.indexOf(path.sep) > -1 ? path.dirname(file) : 'Uncategorized';
                command.info.category = category;

                if (this._categories.indexOf(category) === -1)
                    this._categories.push(category);
            }

            if (typeof command.init === 'function') {
                try {
                    command.init(bot);
                } catch (err) {
                    return bot.logger.severe(`Failed to init '${file}':`, err);
                }
            }

            this._commands.push(command);
        });
    }

    all(category) {
        return !category ? this._commands : this._commands.filter(c => c.info.category.toLowerCase() === category.toLowerCase());
    }

    categories() {
        return this._categories;
    }

    get(name) {
        return this.findBy('name', name);
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

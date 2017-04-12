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

        var bot = this.bot;

        read.fileSync(folder).forEach(file => {
            file = file.substr(folder.length + 1);
            var basename = file.substr(file.lastIndexOf('/') + 1);

            if (basename.startsWith('_') || !basename.endsWith('.js')) return;

            var command = require(`${folder}/${file}`);
            var error = this._validateCommand(command);
            if (error) {
                return bot.logger.severe(`Failed to load '${file}': ${chalk.red(error)}`);
            }

            if (!command.category) {
                var category = file.indexOf(path.sep) > -1 ? path.dirname(file) : 'Uncategorized';
                command.info.category = category;

                if (this._categories.indexOf(category) === -1)
                    this._categories.push(category);
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
        msg.error = ((message, delay) => msg.edit(`:no_entry_sign: ${message || 'An error has occurred!'}`).then(m => m.delete(delay || 2000))).bind(msg);


        try {
            command.run(this.bot, msg, args);
        } catch (e) {
            msg.error(e);
            console.error(e);
        }
    }

}

module.exports = CommandManager;
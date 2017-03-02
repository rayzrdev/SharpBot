const chalk = require('chalk');

/**
 * The SharpBot logger
 * 
 * @class Logger
 */
class Logger {
    /**
     * Creates an instance of Logger.
     * @param {SharpBot} bot 
     * 
     * @memberOf Logger
     */
    constructor(bot) {
        this.bot = bot;
    }

    _log(prefix, message) {
        console.log(`${prefix} ${message}`);
    }

    info(message) {
        this._log(chalk.green('\u2713'), message);
    }

    warn(message) {
        this._log(chalk.yellow('!'), message);
    }

    severe(message) {
        this._log(chalk.red('!'), message);
    }
}

module.exports = Logger;
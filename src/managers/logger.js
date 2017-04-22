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
        (console._original.log || console.log)(`${prefix} ${message}`);
    }

    info(message) {
        this._log(chalk.green('\u2713'), message);
    }

    warn(message, error) {
        this._log(chalk.yellow('!'), message);
        error && console.error(error);
    }

    severe(message, error) {
        this._log(chalk.red('!'), message);
        error && console.error(error);
    }

    inject() {
        if (console._original) throw 'Logger already injected!';

        let original = {
            log: console.log,
            info: console.info,
            error: console.error
        };

        console._original = original;

        console.log = this._wrap(this.info);
        console.info = this._wrap(this.warn);
        console.error = this._wrap(this.severe);
    }

    _wrap(func) {
        let self = this;
        return function () {
            func.call(self, Array.from(arguments));
        };
    }
}

module.exports = Logger;

const prompt = require('prompt');
const chalk = require('chalk');

const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

prompt.message = '';
prompt.delimiter = chalk.green(' >');

const questions = {
    properties: {
        botToken: {
            pattern: /^[a-zA-Z0-9_\.\-]+$/,
            type: 'string',
            message: 'Token can only contain letters, numbers, underscores and dashes',
            required: true,
            hidden: true,
            replace: '*'
        },
        prefix: {
            type: 'string',
            default: '//',
            required: false
        }
    }
};

exports.load = (bot, base) => {
    var configFile = path.resolve(base, '../config.json');

    if (!fs.existsSync(configFile)) {
        prompt.get(questions, (err, res) => {

            fse.writeJSONSync(configFile, res);
        });
        return null;
    }

    return require(configFile);
};
#!/usr/bin/env

const path = require('path');
const { fork } = require('child_process');
const meow = require('meow');

const wait = ms => new Promise(_ => setTimeout(_, ms));

const cli = meow(
    `
    Usage
      $ sharpbot

    Options
      --configDir, -c <folder>
        What folder to use for storing the config files.

      --dataDir, -d <folder>
        What folder to use for storing the data files.

      --token, -t <token>
        What user token to use.

      --prefix, -p <prefix>
        What prefix to use.

      --debug, -D
        Debug SharpBot and report the results.

      --config, -C
        Run the SharpBot configuration wizard.
`,
    {
        configDir: {
            alias: 'c',
            type: 'string'
        },
        dataDir: {
            alias: 'd',
            type: 'string'
        },
        token: {
            alias: 't',
            type: 'string'
        },
        prefix: {
            alias: 'p',
            type: 'string'
        },
        debug: {
            alias: 'D',
            type: 'boolean'
        },
        config: {
            alias: 'C',
            type: 'boolean'
        }
    }
);

function start() {
    fork(path.resolve(__dirname, '..', 'src', 'bot.js'), process.argv.slice(2)).on('exit', async code => {
        if (code !== 666 && code !== 154 /* = 666 & 255 */) {
            console.log('Process has exited. Rebooting... (3 seconds)');
            await wait(3000);
            start();
        } else {
            console.log('Clean exit.');
        }
    });
}

start();

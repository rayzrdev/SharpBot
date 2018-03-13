#!/usr/bin/env

const path = require('path');
const { fork } = require('child_process');

const wait = ms => new Promise(_ => setTimeout(_, ms));

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

'use strict';

const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
const readline = require('readline');
const didYouMean = require('didyoumean2');
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');

const bot = global.bot = exports.client = new Discord.Client();

bot.managers = {};

const configManager = bot.managers.config = new Managers.Config(bot, __dirname);

bot.config = global.config = configManager.load();
bot.storage = new Managers.Storage();

bot.managers.notifications = new Managers.Notifications();

const logger = bot.logger = new Managers.Logger(bot);
const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.managers.stats = new Managers.Stats(bot);

logger.inject();

const settings = global.settings = {
    dataFolder: path.resolve(__dirname, '..', 'data'),
    configsFolder: path.resolve(__dirname, '..', 'data', 'configs')
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

Managers.Migrator.migrate(bot, __dirname);

let loaded = false;

bot.on('ready', () => {
    bot.utils = require('./utils');

    commands.loadCommands(path.resolve(__dirname, 'commands'));

    (title => {
        process.title = title;
        process.stdout.write(`\u001B]0;${title}\u0007`);
    })(`SharpBot - ${bot.user.username}`);

    logger.info(stripIndents`Stats:
        - User: ${bot.user.username}#${bot.user.discriminator} <ID: ${bot.user.id}>
        - Users: ${bot.users.filter(user => !user.bot).size}
        - Bots: ${bot.users.filter(user => user.bot).size}
        - Channels: ${bot.channels.size}
        - Guilds: ${bot.guilds.size}`
    );

    stats.set('start-time', process.hrtime());

    delete bot.user.email;
    delete bot.user.verified;
    bot.user.setStatus('invisible');

    logger.info('Bot loaded');

    readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: ''
    }).on('line', line => {
        try {
            console.log(eval(line) || 'undefined');
        } catch (err) {
            console.error(err);
        }
    }).on('SIGINT', () => {
        process.exit();
    });

    loaded = true;
});

bot.on('message', msg => {
    stats.increment(`messages-${bot.user.id === msg.author.id ? 'sent' : 'received'}`);
    if (msg.isMentioned(bot.user)) {
        stats.increment('mentions');
    }

    if (msg.author.id !== bot.user.id) return;

    if (msg.guild && bot.config.blacklistedServers && bot.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
        return;
    }

    if (msg.isMentioned(bot.user.id)) {
        console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
    }

    const prefix = bot.config.prefix;
    if (!msg.content.startsWith(prefix)) return;

    let split = msg.content.substr(prefix.length).trim().split(' ');
    let base = split[0].toLowerCase();
    let args = split.slice(1);

    // Try to find a built in command first
    let command = commands.get(base);

    if (command) {
        commands.execute(msg, command, args);
        return;
    }

    // If that fails, look for a shortcut
    const shortcut = bot.storage('shortcuts').get(base);

    if (shortcut) {
        base = shortcut.command.split(' ')[0].toLowerCase();
        args = shortcut.command.split(' ').splice(1).concat(args);

        command = commands.get(base);

        if (command) {
            commands.execute(msg, command, args);
        } else {
            return msg.edit(`:no_entry_sign: The shortcut \`${shortcut.name}\` is improperly set up!`).then(m => m.delete(2000));
        }
        return;
    }

    // If no shortcuts could be found either, try finding the closest command
    const maybe = didYouMean(base, commands.all().map(c => c.info.name), {
        threshold: 5,
        thresholdType: 'edit-distance'
    });

    if (maybe) {
        msg.edit(`:question: Did you mean \`${prefix}${maybe}\`?`).then(m => m.delete(5000));
    } else {
        msg.edit(`:no_entry_sign: No commands were found that were similar to \`${prefix}${base}\``)
            .then(m => m.delete(5000));
    }
});

process.on('exit', () => {
    bot.storage.saveAll();
    loaded && bot.destroy();
});

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', event => {
    if (event.code === 1000) {
        logger.info('Disconnected from Discord cleanly');
    } else {
        logger.warn(`Disconnected from Discord with code ${event.code}`);
    }
});

process.on('uncaughtException', (err) => {
    let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
    logger.severe(errorMsg);
});

process.on('unhandledRejection', err => {
    // Force the user to reconfigure if their token is invalid
    if (err.message === 'Incorrect login details were provided.') {
        logger.severe(`${err.message} Please reconfigure with ${chalk.green('yarn run config')}`);
        process.exit(666);
    } else {
        logger.severe('Uncaught Promise error: \n' + err.stack);
    }
});

bot.config && bot.login(bot.config.botToken);

'use strict';

require('./polyfills');

const path = require('path');
const fse = require('fs-extra');
const Discord = require('discord.js');
// const readline = require('readline');
// const didYouMean = require('didyoumean2');
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');

const bot = global.bot = exports.client = new Discord.Client();

bot.managers = {};

const logger = bot.logger = new Managers.Logger(bot);
logger.inject();

bot.managers.dynamicImports = global.dynamicImports = new Managers.DynamicImports(bot, __dirname);
bot.managers.dynamicImports.init();

const configManager = bot.managers.config = new Managers.Config(bot, __dirname, bot.managers.dynamicImports);

bot.config = global.config = configManager.load();

const pluginManager = bot.plugins = bot.managers.pluginManager = new Managers.Plugins(bot);
pluginManager.loadPlugins();

bot.storage = new Managers.Storage();

bot.managers.notifications = new Managers.Notifications(bot);

const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.managers.stats = new Managers.Stats(bot);


const settings = global.settings = {
    dataFolder: path.resolve(__dirname, '..', 'data'),
    configsFolder: path.resolve(__dirname, '..', 'data', 'configs')
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

Managers.Migrator.migrate(bot, __dirname);

let loaded = false;

bot.on('ready', () => {
    // Fix mobile notifications
    bot.user.setAFK(true);

    bot.utils = require('./utils');

    commands.loadCommands();

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

    // TODO: This seems to be breaking crap.
    // readline.createInterface({
    //     input: process.stdin,
    //     output: process.stdout,
    //     prompt: ''
    // }).on('line', line => {
    //     try {
    //         console.log(eval(line) || 'undefined');
    //     } catch (err) {
    //         console.error(err);
    //     }
    // }).on('SIGINT', () => {
    //     process.exit();
    // });

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

    return bot.commands.handleCommand(msg, msg.content);
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
    } else if (err.message === 'Not Found') {
        // message.delete() called on a non-existant message.
        return;
    } else {
        logger.severe('Uncaught Promise error: \n' + err.stack);
    }
});

bot.config && bot.login(bot.config.botToken);

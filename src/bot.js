'use strict';

const Discord = require('discord.js');
const fse = require('fs-extra');
const path = require('path');
const didYouMean = require('didyoumean2');
const XPDB = require('xpdb');
const stripIndents = require('common-tags').stripIndents;
const Managers = require('./managers');

const bot = exports.client = new Discord.Client();
Managers.Migrator.migrate(bot, __dirname);

const configManager = bot.configManager = new Managers.Config(bot, __dirname);
const config = bot.config = configManager.load();

const logger = bot.logger = new Managers.Logger(bot);
const commands = bot.commands = new Managers.CommandManager(bot);
const stats = bot.stats = new Managers.Stats(bot);

logger.inject();

let dataFolder = path.join(__dirname, '../data/');
if (!fse.existsSync(dataFolder)) fse.mkdirSync(dataFolder);
const db = bot.db = new XPDB(path.join(dataFolder, 'db'));

bot.on('ready', () => {
    bot.utils = require('./utils');

    commands.loadCommands(path.join(__dirname, 'commands'));

    process.title = `SharpBot - ${bot.user.username}`;

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
});

bot.on('message', msg => {
    stats.increment(`messages-${bot.user.id === msg.author.id ? 'sent' : 'received'}`);
    if (msg.isMentioned(bot.user)) {
        stats.increment('mentions');
    }

    if (msg.author.id !== bot.user.id) return;

    if (msg.guild && config.blacklistedServers && config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
        return;
    }

    if (msg.isMentioned(bot.user.id)) {
        console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
    }

    if (!msg.content.startsWith(config.prefix)) return;

    let split = msg.content.split(' ');
    let base = split[0].substr(config.prefix.length).toLowerCase();
    let args = split.slice(1);

    let command = commands.get(base);

    if (command) {
        commands.execute(msg, command, args);
    } else {
        db.get(`shortcuts.${base}`).then(sc => {
            if (!sc) {
                let maybe = didYouMean(base, commands.all().map(c => c.info.name), {
                    threshold: 5,
                    thresholdType: 'edit-distance'
                });

                if (maybe) {
                    msg.edit(`:question: Did you mean \`${config.prefix}${maybe}\`?`).then(m => m.delete(5000));
                } else {
                    msg.edit(`:no_entry_sign: No commands were found that were similar to \`${config.prefix}${base}\``)
                        .then(m => m.delete(5000));
                }
            } else {
                base = sc.command.split(' ')[0].toLowerCase();
                args = sc.command.split(' ').splice(1).concat(args);

                command = commands.get(base);

                if (command) {
                    commands.execute(msg, command, args);
                } else {
                    return msg.edit(`:no_entry_sign: The shortcut \`${sc.name}\` is improperly set up!`).then(m => m.delete(2000));
                }
            }
        });
    }
});

process.on('exit', () => {
    bot.db.unwrap().close();
});

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', console.warn);

process.on('uncaughtException', (err) => {
    let errorMsg = (err.stack || err || '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
    logger.severe(errorMsg);
});

process.on('unhandledRejection', err => {
    logger.severe('Uncaught Promise error: \n' + err.stack);
});

config && bot.login(config.botToken);

/**
 * @typedef {Discord.Client} SharpBot
 * @property {Object} config The bot config
 */


'use strict';
const Managers = require('./managers');

const Discord = require('discord.js');
const fs = require('fs');
const path = require('path');
const didYouMean = require('didyoumean2');
const chalk = require('chalk');

const XPDB = require('xpdb');

const stripIndents = require('common-tags').stripIndents;

const bot = exports.client = new Discord.Client();
const config = bot.config = require('./config.json');

const logger = bot.logger = new Managers.Logger(bot);

const commands = bot.commands = new Managers.CommandManager(bot);

let dataFolder = path.join(__dirname, '../data/');
if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);

const db = bot.db = new XPDB(path.join(dataFolder, 'tags'));

if (fs.existsSync(path.join(__dirname, '../selfbot.sqlite'))) {
    try {
        console.log('Migrating DB...');
        var oldDB = require('sqlite');
        oldDB.open('./selfbot.sqlite').then(() => {
            oldDB.all('SELECT * FROM tags').then(rows => {
                rows.forEach(row => {
                    db.put(`tags.${row.name}`, {
                        name: row.name,
                        contents: row.contents,
                        used: row.used,
                        added: row.added
                    });
                });
                console.log('Migration complete. Please set `migrateTagsDB` to `false` in the config file.');
            });
        });
    } catch (err) {
        console.error('Failed to migrate database!', err);
        process.exit(1);
    } finally {
        fs.unlinkSync(path.join(__dirname, '../selfbot.sqlite'));
    }
}

bot.on('ready', () => {

    bot.utils = require('./utils');

    commands.loadCommands(path.join(__dirname, 'commands'));

    console.log(chalk.yellow(stripIndents`### STATS ###
        - Users: ${bot.users.filter(user => !user.bot).size} 
        - Bots: ${bot.users.filter(user => user.bot).size}
        - Channels: ${bot.channels.size}
        - Guilds: ${bot.guilds.size}`
    ));

    delete bot.user.email;
    delete bot.user.verified;

    logger.info('Bot loaded');
});

bot.on('message', msg => {
    if (msg.isMentioned(bot.user.id)) {
        console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
    }

    if (msg.author.id !== bot.user.id) {
        if (msg.isMentioned(bot.user.id) && bot.afk) msg.reply(`${bot.user.username} is \u200bAFK`).then(m => m.delete(5000));
        return;
    }
    if (!msg.content.endsWith('is \u200bAFK') && bot.afk) bot.afk = false;
    if (!msg.content.startsWith(config.prefix)) return;

    var base = msg.content.split(' ')[0].substr(config.prefix.length);
    var args = msg.content.split(' ').splice(1);

    var command = commands.get(base);

    if (command) {
        commands.execute(msg, command, args);
    } else {
        db.get(`shortcuts.${base}`).then(sc => {
            if (!sc) {
                var maybe = didYouMean(base, Object.keys(commands), {
                    threshold: 5,
                    thresholdType: 'edit-distance'
                });

                if (maybe) {
                    msg.edit(`:question: Did you mean \`${config.prefix}${maybe}\`?`).then(m => m.delete(5000));
                } else {
                    msg.edit(`:no_entry_sign: No commands were found that were similar to \`${config.prefix}${command}\``)
                        .then(m => m.delete(5000));
                }
            } else {
                base = sc.command.split(' ')[0];
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

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', console.warn);

bot.login(config.botToken);

process.on('uncaughtException', (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error(errorMsg);
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: \n' + err.stack);
});

'use strict';
const Discord = require('discord.js');
const fs = require('fs');
const didYouMean = require('didyoumean2');
const chalk = require('chalk');

const bot = exports.client = new Discord.Client();
const config = bot.config = require('./config.json');

const commands = bot.commands = {};

// Before using, rename `selfbot.sqlite.example` to `selfbot.sqlite`
const db = bot.db = require('sqlite');
db.open('./selfbot.sqlite');

bot.on('ready', () => {
    console.log(`SharpBot: Connected to ${bot.guilds.size} servers, for a total of ${bot.channels.size} channels and ${bot.users.size} users.`);
    delete bot.user.email;
    delete bot.user.verified;
    fs.readdirSync(__dirname + '/commands/').forEach(file => {
        if (file.startsWith('_') || !file.endsWith('.js')) return;
        var command = require(`./commands/${file}`);
        if (typeof command.run !== 'function' || typeof command.info !== 'object' || typeof command.info.name !== 'string') {
            console.log(`Invalid command file: ${file}`);
            return;
        }
        commands[command.info.name] = command;
    });
    console.log(chalk.green('\u2713') + ' Bot loaded');
});

bot.on('message', msg => {
    if (msg.isMentioned(bot.user.id)) {
        console.log(`[MENTION] ${msg.author.username} (${msg.author.id}) on ${msg.guild.name}/${msg.channel.name}:\n${msg.content}`);
    }

    if (msg.author.id !== bot.user.id) {
        if (msg.isMentioned(bot.user.id) && bot.afk) msg.reply(`${bot.user.username} is \u200bAFK`).then(m => m.delete(5000));
        return;
    }
    if (!msg.content.endsWith('is \u200bAFK') && bot.afk) bot.afk = false;
    if (!msg.content.startsWith(config.prefix)) return;

    const command = msg.content.split(' ')[0].substr(config.prefix.length);
    const args = msg.content.split(' ').splice(1);

    if (commands[command]) {
        msg.editEmbed = (embed) => { this.edit('', { embed }); };

        try {
            commands[command].run(bot, msg, args);
        } catch (e) {
            msg.edit(msg.author + `Error while executing command\n${e}`).then(m => m.delete(5000));
            console.error(e);
        }
    } else {
        var maybe = didYouMean(command, Object.keys(commands), {
            threshold: 5,
            thresholdType: 'edit-distance'
        });

        if (maybe) {
            msg.edit(`:question: Did you mean \`${config.prefix}${maybe}\`?`).then(m => m.delete(5000));
        } else {
            msg.edit(`:no_entry_sign: No commands were found that were similar to \`${config.prefix}${command}\``)
                .then(m => m.delete(5000));
        }
    }
});

bot.on('error', console.error);
bot.on('warn', console.warn);
bot.on('disconnect', console.warn);

bot.login(config.botToken);
bot.password = config.password;

process.on('uncaughtException', (err) => {
    let errorMsg = err.stack.replace(new RegExp(`${__dirname}\/`, 'g'), './');
    console.error(errorMsg);
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: \n' + err.stack);
});
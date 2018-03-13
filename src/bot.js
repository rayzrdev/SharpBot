'use strict';

const fse = require('fs-extra');
const envPaths = require('env-paths');
const { Client, Collection } = require('discord.js');
const stripIndents = require('common-tags').stripIndents;
const chalk = require('chalk');
const Managers = require('./managers');

// Settings

const paths = envPaths('SharpBot', { suffix: '' });
const settings = global.settings = {
    paths,
    dataFolder: paths.data,
    configsFolder: paths.config
};

if (!fse.existsSync(settings.dataFolder)) fse.mkdirSync(settings.dataFolder);
if (!fse.existsSync(settings.configsFolder)) fse.mkdirSync(settings.configsFolder);

class SharpBot extends Client {
    constructor(config = {}) {
        super();

        global.bot = this;

        // Managers
        this.managers = {};

        // Logger
        const logger = this.logger = new Managers.Logger(this);
        logger.inject();

        // Dynamic imports
        this.managers.dynamicImports = new Managers.DynamicImports(this, __dirname);
        this.managers.dynamicImports.init();

        // Config
        this.managers.config = new Managers.Config(this, __dirname, this.managers.dynamicImports);
        this.config = global.config = this.managers.config.load();

        // Plugins
        this.plugins = this.managers.pluginManager = new Managers.Plugins(this);
        this.plugins.loadPlugins();

        // Storage
        this.storage = new Managers.Storage();

        // Notifications
        this.managers.notifications = new Managers.Notifications(this);

        // Commands
        const commands = this.commands = new Managers.CommandManager(this);

        // Stats
        const stats = this.managers.stats = new Managers.Stats(this);

        Managers.Migrator.migrate(this);

        // Deleted message record handler
        this.deleted = new Collection();
        this.setInterval(() => {
            this.deleted.clear();
        }, 7200000);

        // Uncategorized
        this.loaded = false;
        this.utils = global.utils = require('./utils');

        // Event listeners
        this.on('ready', () => {
            if (this.user.bot) {
                logger.severe(`SharpBot is a selfbot, but you entered a bot token. Please follow the instructions at ${chalk.green('https://github.com/RayzrDev/SharpBot#getting-your-user-token')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
                process.exit(666);
            }

            // Fix mobile notifications
            this.user.setAFK(true);

            commands.loadCommands();

            (title => {
                process.title = title;
                process.stdout.write(`\u001B]0;${title}\u0007`);
            })(`SharpBot - ${this.user.username}`);

            logger.info(stripIndents`Stats:
            - User: ${this.user.username}#${this.user.discriminator} <ID: ${this.user.id}>
            - Prefix: ${this.config.prefix}
            - Users: ${this.users.filter(user => !user.bot).size}
            - Bots: ${this.users.filter(user => user.bot).size}
            - Channels: ${this.channels.size}
            - Guilds: ${this.guilds.size}`
            );

            stats.set('start-time', process.hrtime());

            delete this.user.email;
            delete this.user.verified;

            logger.info('Bot loaded');

            this.loaded = true;
        });

        this.on('message', msg => {
            stats.increment(`messages-${this.user.id === msg.author.id ? 'sent' : 'received'}`);
            if (msg.isMentioned(this.user)) {
                stats.increment('mentions');
                console.log(`[MENTION] ${msg.author.username} | ${msg.guild ? msg.guild.name : '(DM)'} | #${msg.channel.name || 'N/A'}:\n${msg.cleanContent}`);
            }

            if (msg.author.id !== this.user.id) return;

            if (msg.guild && this.config.blacklistedServers && this.config.blacklistedServers.indexOf(msg.guild.id.toString()) > -1) {
                return;
            }

            return this.commands.handleCommand(msg, msg.content);
        });

        this.on('messageDelete', msg => this.deleted.set(msg.author.id, msg));

        this.on('error', console.error);
        this.on('warn', console.warn);
        this.on('disconnect', event => {
            if (event.code === 1000) {
                this.logger.info('Disconnected from Discord cleanly');
            } else if (event.code === 4004) {
                // Force the user to reconfigure if their token is invalid
                this.logger.severe(`Failed to authenticate with Discord. Please follow the instructions at ${chalk.green('https://github.com/RayzrDev/SharpBot#getting-your-user-token')} and re-enter your token by running ${chalk.green('yarn run config')}.`);
                process.exit(666);
            } else {
                this.logger.warn(`Disconnected from Discord with code ${event.code}`);
            }
        });

        // Process handlers
        process.on('exit', () => {
            this.storage.saveAll();
            this.loaded && this.destroy();
        });

        process.on('uncaughtException', (err) => {
            let errorMsg = (err ? err.stack || err : '').toString().replace(new RegExp(`${__dirname}\/`, 'g'), './');
            this.logger.severe(errorMsg);
        });

        process.on('unhandledRejection', err => {
            this.logger.severe('Uncaught Promise error: \n' + err.stack);
        });
    }

    start() {
        if (this.config) {
            this.login(this.config.botToken);
            return true;
        } else {
            return false;
        }
    }
}


// Temporary: We're eventually gonna have a CLI-based launcher for this.
exports.client = new SharpBot();
exports.client.start();

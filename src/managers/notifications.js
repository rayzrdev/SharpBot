const {stripIndents} = require('common-tags');

class NotificationManager {
    constructor(bot) {
        this._bot = bot;
        this.availablePlugins = bot.plugins.getAllOfType(NotificationManager.PLUGIN_TYPE);
    }

    notify(title, message) {
        this.availablePlugins.forEach(plugin => {
            try {
                plugin.notify(title, message)
                    .catch(() => {});
            } catch (e) {} // eslint-disable-line no-empty
        });
        console.log(stripIndents`
        Notification:
            Title: ${title}
            Message: ${message}
        `);
    }
}

NotificationManager.PLUGIN_TYPE = 'notifications';

module.exports = NotificationManager;

const nn = require('node-notifier');
const opn = require('opn');
const NotificationManager = require('../managers/notifications');

class DesktopNotifier {
    constructor(bot) {
        this._bot = bot;

        this.init();
    }

    init() {
        nn.on('click', () => {
            opn('', { app: 'Discord' });
        });
    }

    notify(title, message) {
        nn.notify({
            title,
            message,
            wait: true
        });
    }
}

DesktopNotifier.PLUGIN_NAME = 'desktop-notifier';

module.exports = {
    name: DesktopNotifier.PLUGIN_NAME,
    pluginTypes: [NotificationManager.PLUGIN_TYPE],
    run: bot => new DesktopNotifier(bot)
};

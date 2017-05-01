const nn = require('node-notifier');
const opn = require('opn');

nn.on('click', () => {
    opn('', { app: 'Discord' });
});

class NotificationManager {
    notify(title, message) {
        nn.notify({
            title,
            message,
            wait: true
        });
    }
}

module.exports = NotificationManager;

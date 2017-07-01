const fse = require('fs-extra');
const path = require('path');

exports.migrate = function (bot, base) {
    migrateConfig(bot, base);
    migrateDBName(bot, base);
    migrateFromDB(bot, base);
};

function migrateConfig(bot, base) {
    let firstPath = path.resolve(base, 'config.json');
    let secondPath = path.resolve(base, '../config.json');
    let thirdPath = path.resolve(base, '../data/configs/config.json');

    moveIfExists(firstPath, secondPath, 'Failed to migrate config.json!');
    moveIfExists(secondPath, thirdPath, 'Failed to migrade config.json to configs!');
}

function migrateDBName(bot, base) {
    let oldDataPath = path.resolve(base, '../data/tags');
    let newDataPath = path.resolve(base, '../data/db');

    moveIfExists(oldDataPath, newDataPath, 'Failed to rename tags folder!');
}

function migrateFromDB(bot, base) {
    let dbPath = path.resolve(base, '../data/db');
    if (fse.existsSync(dbPath)) {
        const XPDB = require('xpdb');
        const db = new XPDB(dbPath);

        const tags = bot.storage('tags');
        const shortcuts = bot.storage('shortcuts');

        db.entries().then(entries => {
            entries.forEach(entry => {
                if (entry.key.startsWith('tags.')) {
                    const key = entry.key.substr(5);
                    tags.set(key, entry.value);
                } else if (entry.key.startsWith('shortcuts.')) {
                    const key = entry.key.substr(10);
                    shortcuts.set(key, entry.value);
                }
            });
        }).then(() => {
            tags.save();
            shortcuts.save();

            db.unwrap().close(() => {
                fse.renameSync(dbPath, `${dbPath}-backup-${Date.now()}`);
            });
        }).catch(error => {
            console.error(error);
            process.exit(1);
        });
    }
}


/*** UTILITIES ***/
function moveIfExists(oldPath, newPath, failMessage) {
    if (fse.existsSync(oldPath)) {
        try {
            fse.renameSync(oldPath, newPath);
        } catch (err) {
            console.error(failMessage);
            process.exit(1);
        }
    }
}

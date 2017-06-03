const fse = require('fs-extra');
const path = require('path');

exports.migrate = function (bot, base) {
    migrateConfig(bot, base);
    migrateDBName(bot, base);
    migrateFromDB(bot, base);
};

function migrateConfig(bot, base) {
    let oldPath = path.resolve(base, 'config.json');
    let newPath = path.resolve(base, '../config.json');
    let newNewPath = path.resolve(base, '../data/configs/config.json');

    if (fse.existsSync(oldPath)) {
        try {
            fse.moveSync(oldPath, newPath);
        } catch (err) {
            console.error('Failed to migrate config.json!', err);
            process.exit(1);
        }
    }

    if (fse.existsSync(newPath)) {
        try {
            fse.moveSync(newPath, newNewPath);
        } catch (err) {
            console.error('Failed to migrade config.json to configs!');
            process.exit(1);
        }
    }
}

function migrateDBName(bot, base) {
    let oldDataPath = path.resolve(base, '../data/tags');
    let newDataPath = path.resolve(base, '../data/db');
    if (fse.existsSync(oldDataPath)) {
        try {
            fse.renameSync(oldDataPath, newDataPath);
        } catch (err) {
            console.error('Failed to rename tags folder!');
            process.exit(1);
        }

    }
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

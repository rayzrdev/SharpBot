const fs = require('fs');
const path = require('path');

exports.migrate = function (bot, base) {
    this._migrateTagsDB(bot, base);
};

exports._migrateTagsDB = function (bot, base) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(path.join(base, '../selfbot.sqlite'))) {
            bot.logger.info('Migrating DB to XPDB...');
            var oldDB = require('sqlite');

            oldDB.open('./selfbot.sqlite').then(() => {
                oldDB.all('SELECT * FROM tags').then(rows => {
                    Promise.all(
                        rows.map(row => bot.db.put(`tags.${row.name}`, {
                            name: row.name,
                            contents: row.contents,
                            used: row.used,
                            added: row.added
                        }))
                    ).then(() => bot.logger.info('Database migration complete.'));
                });
            }).then(() => {
                bot.logger.info('Moving old database...');
                fs.renameSync(path.join(base, '../selfbot.sqlite'), path.join(base, '../selfbot.sqlite.bak'));
                bot.logger.info('Done. You can safely delete the selfbot.sqlite.bak file.');
            }).catch(err => {
                bot.logger.severe('Failed to migrate database!', err);
            });
        }
    });
};
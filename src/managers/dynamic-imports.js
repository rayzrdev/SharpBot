const read = require('readdir-recursive');
const path = require('path');

class DynamicImportsManager {
    constructor(bot, base) {
        this._bot = bot;
        this._base = base;

        /*
        {
            folder: {
                file: import
            }
        }
         */
        this._imports = {};

        this._optionalConfigs = {};
    }

    /**
     * The base path that all dynamic imports are loaded from.
     *
     * @type {string}
     * @readonly
     *
     * @memberof DynamicImportsManager
     */
    get base() {
        return this._base;
    }

    /**
     * The bot reference.
     *
     * @readonly
     *
     * @memberof DynamicImportsManager
     */
    get bot() {
        return this._bot;
    }

    /**
     * Initializes the dynamic imports and loads all folders.
     *
     * @memberof DynamicImportsManager
     */
    init() {
        DynamicImportsManager.FOLDERS_TO_LOAD.forEach(folder => {
            this.loadFolder(folder);
        });
    }

    /**
     * The optional configs object.
     *
     * @type {Object}
     * @readonly
     *
     * @memberof DynamicImportsManager
     */
    get optionalConfigs() {
        return Object.assign({}, this._optionalConfigs);
    }

    /**
     * Loads the contents of a specific folder.
     *
     * @param {string} folderName The name of the folder to load, relative to the base path.
     *
     * @memberof DynamicImportsManager
     */
    loadFolder(folderName) {
        const folder = path.resolve(this._base, folderName);

        try {
            read.fileSync(folder).forEach(file => {
                let basename = path.basename(file);
                if (basename.startsWith('_') || !basename.endsWith('.js')) return;

                let imported = require(file);

                if (imported.configs) {
                    imported.configs.forEach(config => {
                        this._optionalConfigs[config.name] = config;
                    });
                }

                if (!this._imports[folderName]) {
                    this._imports[folderName] = {};
                }

                this._imports[folderName][file] = imported;
            });
        } catch (e) {
            console.error(`Unable to load modules from ${folderName}`);
        }
    }

    getImport(folderName) {
        let imported = this._imports[folderName];
        if (!imported) {
            this.loadFolder(folderName);
        }
        return Object.assign({}, this._imports[folderName]);
    }
}

DynamicImportsManager.FOLDERS_TO_LOAD = ['plugins', 'commands'];

module.exports = DynamicImportsManager;


class PluginsManager {
    constructor(bot) {
        this._bot = bot;
        this._plugins = {};
    }

    loadPlugins() {
        if (!this._bot.config) {
            return;
        }
        const plugins = this._bot.managers.dynamicImports.getImport('plugins');
        Object.keys(plugins).forEach(plugin => {
            const pluginDefinition = plugins[plugin];

            if (pluginDefinition.configs && !pluginDefinition.configs.every(config => !!this._bot.config[config.name])) {
                // console.log(`Config for plugin ${pluginDefinition.name} not satisfied, skipping.`);
                return;
            }

            this._plugins[pluginDefinition.name] = {
                plugin: pluginDefinition.run(this._bot),
                pluginDefinition: pluginDefinition
            };
        });
    }

    get(name) {
        const pluginItem = this._plugins[name];
        if (pluginItem) {
            return pluginItem.plugin;
        } else {
            return null;
        }
    }

    getAllOfType(type) {
        return Object.keys(this._plugins).
            map(pluginName => {
                const pluginItem = this._plugins[pluginName];
                if ((pluginItem.pluginDefinition.pluginTypes || []).indexOf(type) !== -1) {
                    return pluginItem.plugin;
                }
            })
            .filter(plugin => !!plugin);
    }
}

module.exports = PluginsManager;

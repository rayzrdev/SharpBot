const path = require('path');

const DynamicImportsManager = require('../managers/dynamic-imports');
const ConfigManager = require('../managers/config');

const importManager = new DynamicImportsManager(null, path.join(__dirname, '..'));
importManager.init();
const configManager = new ConfigManager(null, path.join(__dirname, '..'), importManager);

configManager.load(true);

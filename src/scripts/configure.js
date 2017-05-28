const path = require('path');
const ConfigManager = require('../managers/config');

const manager = new ConfigManager(null, path.join(__dirname, '..'));

manager.load(true);
